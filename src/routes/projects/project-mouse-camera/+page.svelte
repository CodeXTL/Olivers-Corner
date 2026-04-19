<svelte:head>
	<title>MouseCam | Oliver's Corner</title>
</svelte:head>

<div class="page-wrapper">
	<main>
		<a
			href="/projects"
			style="color: #888; text-decoration: none; margin-bottom: 2rem; display: inline-block;"
		>
			Back to Projects
		</a>

		<h1>MouseCam: Imaging from an Optical Mouse Sensor</h1>

		<section class="project-section">
			<h2>Overview</h2>
			<p>
				MouseCam is a project with the goal of extracting live image data from the optical sensor
				inside a 20-year-old Logitech mouse and streaming it wirelessly to a PC for display. Optical
				mouse sensors are essentially tiny specialized cameras that capture microscopic images of
				whatever surface is under the mouse, roughly 1500 times per second, and compute motion by
				comparing consecutive frames. This project aims to construct image data from the mouse
				sensor chip by stripping out the mouse's original microcontroller, wiring the sensor chip
				directly to an ESP32-S3 Mini, and using a custom bit-banged serial protocol to read the raw
				pixel array out of the sensor. The captured 16x16 pixel frames are then sent over WiFi to a
				Python viewer on a laptop, which contrast-stretches and upscales them into a live 512x512
				display. The end result is a salvaged mouse acting as a miniature wireless camera.
			</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig1.jpg" alt="Overview shot" />
				<p>
					<strong>Figure 1.</strong> The finished hacked mouse and a live image display of its readings.
					Note that the USB connection is only for powering the mouse.
				</p>
			</div>
		</section>

		<section class="project-section">
			<h2>Project Idea and Descoping</h2>
			<p>
				The original pitch was to build a complete portable camera using the mouse sensor and a
				proper lens assembly, fitting everything into a small battery-powered package. Along the
				way, two parts of that scope proved much more involved than anticipated:
			</p>
			<ul>
				<li>
					Sourcing and aligning a lens that could actually focus an image onto the tiny 1mm x 1mm
					sensor window
				</li>
				<li>Designing a custom enclosure and power system for portable operation.</li>
			</ul>
			<p>
				I also spent time on a dead end early on. Originally, I planned to pull image data through
				the mouse's proprietary Logitech microcontroller, but after hours of reverse-engineering the
				mouse PCB, I realized that talking to the sensor chip directly is an easier approach. That
				effort was not wasted though; what I learned about the mouse's PCB will be useful for
				designing a custom mouse PCB in a future project.
			</p>
			<p>
				Given these constraints, I descoped the project to focus on getting pixel data off of the
				sensor chip itself. This still required reading a dense 20-year-old datasheet, implementing
				a custom serial protocol from scratch, and building the whole capture and visualization
				pipeline. The portable-camera reach goal was dropped, but the core discovery, that you can
				take a discarded mouse and turn it into a live imaging device, was preserved.
			</p>
		</section>

		<section class="project-section">
			<h2>The Sensor: ADNS-2051</h2>
			<p>
				The mouse used for this project is a Logitech M-BJ58, which contains an Agilent ADNS-2051
				optical mouse sensor in a 16-pin staggered DIP package (Figure 2). The datasheet for this
				chip is from 2003, but it is thorough and well-documented.
			</p>
			<p>Two key features of the ADNS-2051 relevant for this project are:</p>
			<ol>
				<li>It has a 16x16 pixel array with a pixel depth of 6 bits.</li>
				<li>A single bi-directional serial port for register read and write access.</li>
			</ol>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig2.jpg" alt="Close up of ADNS2051" />
				<p>
					<strong>Figure 2.</strong> Close-up of the mouse PCB showing the ADNS-2051 chip in the center.
				</p>
			</div>
			<p>
				What makes this sensor interesting for imaging is a feature called
				<strong>Pixel Dump mode</strong>. When a specific bit is set in the configuration register,
				instead of computing motion, the sensor streams out the raw pixel values from its internal
				image array one pixel per frame over the serial port. This is the feature the entire project
				hinges on.
			</p>
		</section>

		<section class="project-section">
			<h2>Hardware Modifications</h2>
			<p>
				The first major task was hijacking the necessary pins from the sensor chip to redirect the
				flow of data. The original mouse had a proprietary Logitech microcontroller that handled USB
				communication and talked to the sensor over its serial clock (SCLK) and serial data
				input/output (SDIO) pins. To take control of the sensor with my own microcontroller, I
				needed to physically disconnect those two pins from the original microcontroller and route
				them to an ESP32-S3 instead. I desoldered the SCLK and SDIO pins of the ADNS-2051 and
				attached thin jumper wires to each pin (Figure 3) so they could be routed out to a
				breadboard for easier prototyping.
			</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig3.jpg" alt="Modified mouse PCB" />
				<p>
					<strong>Figure 3.</strong> The mouse PCB with the Logitech microcontroller removed and jumper
					wires soldered to the SCLK and SDIO pins of the ADNS-2051.
				</p>
			</div>
			<p>
				However, even with SCLK and SDIO rerouted, the original Logitech microcontroller was still
				powered and running its firmware, which was controlling other aspects of the sensor,
				specifically, the sensor's VDD power rail. The ADNS-2051's power was gated through a PNP
				transistor that the original microcontroller was turning on and off as a power saving
				feature. With the original microcontroller in an error state because I had cut its sensor
				communication lines, the sensor's VDD was switching between a low voltages and a few hundred
				millivolts intermittently, which is not enough to run the chip at all times.
			</p>
			<p>
				My fix was to remove the original microcontroller entirely (Figure 3) and short across the
				PNP transistor that was gating sensor power (Figure 4). This permanently connects the
				sensor's VDD to the USB 5V rail and eliminates all interference from the original firmware.
				Unfortunately, this does mean that the mouse can no longer function as a mouse, but that is
				not pertinent for this project.
			</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig4.jpg" alt="Backside of mouse PCB after shorting PNP" />
				<p>
					<strong>Figure 4.</strong> The backside of the mouse PCB showing a wire shorting the emitter
					and collecter of the PNP transistor to provide 5V directly to the sensor chips VDD.
				</p>
			</div>
			<p>On the ESP32 side, I used two GPIO pins and the GND pin:</p>
			<ul>
				<li>GPIO1: For sending a controlled clock signal to the sensor chip's SCLK pin.</li>
				<li>
					GPIO2: For sending or reading serial data in sync with SCLK to the sensor chip's SDIO pin.
				</li>
				<li>
					GND: Connected to the ground of the mouse PCB so that it shares a common ground with the
					ESP32.
				</li>
			</ul>
			<p>The following image shows my prototyping testbench setup.</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig5.jpg" alt="Prototyping testbench" />
				<p>
					<strong>Figure 5.</strong> The prototyping setup for testing the hardware.
				</p>
			</div>
			<p>
				One subtle concern was that the ADNS-2051 is a 5V chip while the ESP32-S3's GPIOs are 3.3V,
				which means the sensor's SDIO output high (~5V during reads) technically exceeds the ESP32's
				maximum GPIO input voltage. In practice, the ESP32's internal clamp diodes absorb the
				overvoltage at the low currents involved, which is what most hobbyist projects do. A level
				shifter would be the proper solution, but direct connection has worked without issue for
				this project, so this would be a consideration for future improvements.
			</p>
		</section>

		<section class="project-section">
			<h2>Firmware: Bit-Banging the Serial Protocol</h2>
			<p>
				The ADNS-2051 has a non-standard serial protocol. It uses a single shared data line (SDIO)
				that changes direction based on whether the operation is a read or a write, synchronized by
				a clock line (SCLK). The MSB of the first byte distinguishes read (0) from write (1), and
				reads require the microcontroller to pause for at least 100us after sending the address to
				give the sensor time to prepare its response. Since there's no hardware peripheral on the
				ESP32 that speaks this protocol, I had to implement it from scratch by manually toggling
				GPIO pins in software to generate the correct clock and data waveforms with the necessary
				delays.
			</p>
			<p>The firmware runs two core functions:</p>
			<ul>
				<li><code>reg_write(reg_addr, val)</code> to set sensor configuration registers.</li>
				<li><code>reg_read(reg_addr)</code> to retrieve values.</li>
			</ul>
			<p>
				Both functions work by writing directly to ESP32 GPIO registers with microsecond-level
				timing to meet the sensor's specifications. The toughest part of getting this right was
				setting the necessary delays so there aren't any setup or hold violations.
			</p>
		</section>

		<section class="project-section">
			<h2>Capturing a Full Frame</h2>
			<p>
				In pixel dump mode, the ADNS-2051 streams out one pixel per frame (at 1500 frames per
				second, or ~667μs per pixel). Note that in data dump mode, a frame for the ADNS-2051 is more
				akin to a clock cycle rather than the entire 256-pixel capture.
			</p>
			<p>
				According to the data sheet, each pixel is addressed by an 8-bit address and carries a 6-bit
				brightness value, ranging from 0 (complete black) to 63 (complete white). A validity bit
				indicates whether the data is ready to be read, and the firmware spins on this bit to ensure
				it only captures valid pixel data.
			</p>
			<p>
				The full 256-pixel capture takes about 240ms on my implementation. This is actually close to
				the theoretical minimum imposed by the sensor itself, which is around 170ms, so the protocol
				is running near its physical limit.
			</p>
			<p>
				To view the capture and verify it, I quickly implemented a simple Python script, and Figure
				5 below shows a raw 256-pixel capture of the upper half of the letter 'S'.
			</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig6.png" alt="Raw 256-pixel capture" />
				<p>
					<strong>Figure 6.</strong> A raw 256-pixel capture of the upper half of the letter 'S', with
					a slight blue filter to enhance visibility.
				</p>
			</div>
		</section>

		<section class="project-section">
			<h2>Wireless Data Streaming</h2>
			<p>
				With pixel capture working over USB serial, the next step was moving the data connection
				over WiFi. The ESP32-S3 has built-in 2.4GHz WiFi, so I configured it as a TCP server that
				broadcasts captured frames to any connected client. Each frame is serialized as a single
				line of comma-separated pixel values prefixed with <code>FRAME:</code> and terminated with a newline,
				which makes parsing trivial on the receiving end.
			</p>
			<p>
				The current setup uses a direct connection where the ESP32 and laptop share a 2.4GHz WiFi
				network, and the Python viewer connects to the ESP32's IP address on TCP port 8080.
			</p>
		</section>

		<section class="project-section">
			<h2>Python Visualization</h2>
			<p>
				Once the previous stages have been thoroughly tested, I improved my Python script used
				during testing to connect to the ESP32 over TCP rather than serial. I also switched to using
				OpenCV rather than matplotlib for displaying the images as its update loop is too slow for
				real-time streaming and the display windows were unstable.
			</p>
			<p>The viewer displays two versions of each frame side-by-side:</p>
			<ul>
				<li>
					A nearest-neighbor upscale that preserves the pixel structure on the left (so you can see
					the individual 16x16 pixels).
				</li>
				<li>
					A bicubic upscale with contrast stretching that makes surface textures much more visible
					on the right.
				</li>
			</ul>
			<p>
				A HUD was also added along the bottom to show min/max/mean pixel values, a rolling FPS
				counter, and current frame count. Keyboard controls let me toggle frame averaging (for noise
				reduction), save frames to disk, and adjust the averaging window size.
			</p>
			<div class="image-wrapper">
				<img src="/project-mouse-camera/Fig7.png" alt="Overview of visualization window" />
				<p>
					<strong>Figure 7.</strong> The Python viewer showing the side-by-side raw and enhanced views
					with the HUD stats bar.
				</p>
			</div>
		</section>

		<section class="project-section">
			<h2>Results</h2>
			<p>
				The final system captures live frames from the ADNS-2051 and displays them in real-time on a
				laptop over WiFi, at roughly 2 frames per second (limited by the sensor's own pixel dump
				streaming speed). Surface textures are clearly visible: holding the mouse over white paper
				shows uniform brightness with subtle fiber variations, while moving it over a printed page
				shows distinct dark regions where text is present. The video below shows the live reading
				when moving the mouse over the word "multiplexer." Note that it has been sped up by 2 times
				for the sake of presentation.
			</p>
			<div class="video-wrapper">
				<video autoplay loop muted playsinline>
					<source src="/project-mouse-camera/Vid1.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>
				<p>
					<strong>Video 1.</strong> Sped up live pixel stream from the ADNS-2051, showing the sensor's
					view change as the mouse is moved across the word "multiplexer."
				</p>
			</div>
		</section>

		<section class="project-section">
			<h2>ECE Skills Gained</h2>
			<ul>
				<li>
					<strong>Datasheet reading.</strong> The ADNS-2051 datasheet is 40 pages long and full of timing
					diagrams, register maps, and cryptic sections about serial port synchronization. Becoming fluent
					in reading datasheets, especially knowing which parts to skim and which parts to read line-by-line,
					was a skill I gained throughout this project.
				</li>
				<li>
					<strong>Bit-banged serial protocols.</strong> Before this project, I had only used standard
					hardware peripherals like SPI and I2C. Implementing a custom protocol from scratch, with microsecond-level
					timing requirements, gave me a much deeper understanding of serial protocols.
				</li>
				<li>
					<strong>Embedded debugging.</strong> Because the ADNS-2051 communicates over a custom bus that
					can't be monitored by a standard serial terminal, all debugging had to be done through careful
					incremental testing. Along the way I became comfortable using an oscilloscope to probe the SCLK
					and SDIO lines when bits weren't coming through correctly.
				</li>
				<li>
					<strong>Reverse engineering hardware.</strong> Tracing PCB signals with a multimeter, identifying
					the role of each component on the mouse PCB, and deciding what to keep and what to remove was
					its own kind of engineering puzzle.
				</li>
				<li>
					<strong>Soldering and desoldering skills.</strong> Desoldering fine-pitch pins on a working
					PCB without damaging surrounding components is not a new skill for me, but this project did
					give me some much needed practice.
				</li>
				<li>
					<strong>WiFi and TCP networking on embedded systems.</strong> Getting the ESP32 to serve frames
					over TCP, handling disconnects, and debugging WiFi authentication issues taught me more about
					the OSI stack than any textbook ever did.
				</li>
				<li>
					<strong>Real-time image pipelines.</strong> Building the end-to-end flow from sensor bits through
					serialization, network transport, parsing, and OpenCV display gave me experience with pipelines
					where latency matters.
				</li>
			</ul>
		</section>

		<section class="project-section">
			<h2>Final Thoughts</h2>
			<p>
				This project pushed me further out of my comfort zone. Going in, I thought the main
				challenge would be the optics, but in practice the real challenges were reading the dense
				40-page datasheet in depth, reverse engineering the mouse PCB with no schematics available,
				bit-banging a custom serial protocol, and managing power and sync issues across multiple
				interacting chips. The satisfaction of getting the correct value back from a register after
				hours of debugging is a feeling I want to chase further, and this project has made me more
				interested in the embedded and hardware-close-to-silicon side of ECE. If I continue it, the
				next steps would be adding a proper lens for real imaging, designing a custom PCB that
				eliminates the hacky wiring, and possibly implementing the "hand-held scanner" idea where
				the sensor's own motion tracking data is used to stitch frames into a larger image.
			</p>
		</section>
	</main>
</div>

<style>
	.page-wrapper {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		align-items: center;
	}

	.project-section {
		margin-bottom: 2.5rem;
	}

	.project-section h2 {
		border-bottom: 2px solid #eaeaea;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
	}

	p {
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	ul {
		line-height: 1.6;
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.75rem;
	}

	.image-wrapper img {
		width: 100%;
		border-radius: 10px;
	}

	.image-wrapper p {
		margin-top: 0;
	}

	.video-wrapper video {
		width: 100%;
		border-radius: 10px;
		display: block;
	}

	.video-wrapper p {
		margin-top: 0;
	}

	.image-placeholder {
		background: #f4f4f4;
		border: 2px dashed #ccc;
		padding: 2rem;
		text-align: center;
		color: #666;
		margin: 1.5rem 0;
		border-radius: 8px;
	}

	code {
		background: #f0f0f0;
		padding: 0.15rem 0.35rem;
		border-radius: 4px;
		font-size: 0.95em;
	}
</style>
