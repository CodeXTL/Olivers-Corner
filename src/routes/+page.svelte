<script>
  // Quick data for your links
  let links = [
    { name: 'GitHub', url: 'https://github.com/CodeXTL' },
    { name: 'Email', url: 'mailto:oliverlee.csee@gmail.com' }
  ];
</script>

<main>
  <div class="container">
    <header>
      <h1>Oliver Lee</h1>
      <p class="subtitle">Engineer / Caffeine Addict / Human?</p>
    </header>

    <section class="intro">
        Welcome to my (temporary) website! It is currently a work in progress. 
        Expect dramatic changes in the upcoming 2 weeks!
    </section>

    <section class="bio">
      <p>
        Building things that break, then fixing them. 
        The struggle is how you learn.
      </p>
    </section>

    <nav>
      {#each links as link}
        <a href={link.url} target="_blank" rel="noreferrer">
          {link.name}
        </a>
      {/each}
    </nav>
  </div>
</main>

<style>
  /* 1. Global Reset (Hacky but works) */
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #fcfcfc; /* Off-white for that 'designer' look */
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* 2. Layout */
  .container {
    max-width: 600px;
    margin: 15vh auto; /* Pushes it down the page a bit */
    padding: 0 2rem;
  }

  /* 3. Typography */
  h1 {
    font-size: 1.2rem; /* Small titles are very 'in' right now */
    font-weight: 600;
    margin-bottom: 0.2rem;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0;
  }

  /* 4. Navigation */
  nav {
    display: flex;
    gap: 1.5rem;
  }

  nav a {
    font-size: 0.85rem;
    color: #999;
    text-decoration: none;
    transition: color 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  nav a:hover {
    color: #000;
  }
</style>