<nav class="main-nav">
	<a href="/">Home</a>
	<a href="/about">About Me</a>
	<a href="/resume">Resume</a>
	<a href="/goals">Career Goals</a>
	<a href="/projects">Projects</a>
</nav>

<style>
	.main-nav {
		/**Floats the nav bar to fix the homepage issue*/
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		box-sizing: border-box;
		z-index: 100;
		/* It's yee high and above everything */

		display: flex;
		gap: 1.5rem;
		padding: 1.5rem 10vw;
		background-color: #eee;
	}

	.main-nav a {
		text-decoration: none;
		color: #333;
		font-weight: 600;
	}

	.main-nav a:hover {
		color: #000;
	}
</style>