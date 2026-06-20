const navItems = ["Home", "About", "Animals", "Gallery", "Contact"];
const galleryItems = ["Layered hills", "Paper barn", "Cutout animals"];

export default function Home() {
  return (
    <main className="paper-site">
      <nav className="paper-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a key={item} href={item === "Home" ? "#home" : "#" + item.toLowerCase()}>
            {item}
          </a>
        ))}
      </nav>

      <section id="home" className="farm-scene" aria-label="Moving paper craft farm scene">
        <div className="paper-grain" />
        <div className="sun" />
        <div className="cloud cloud-one" />
        <div className="cloud cloud-two" />
        <div className="cloud cloud-three" />

        <div className="birds bird-one"><span /><span /></div>
        <div className="birds bird-two"><span /><span /></div>

        <div className="hill hill-back" />
        <div className="hill hill-mid" />
        <div className="hill hill-front" />
        <div className="fence" />

        <div className="tree tree-left">
          <span className="trunk" />
          <span className="leaf leaf-a" />
          <span className="leaf leaf-b" />
          <span className="leaf leaf-c" />
          <span className="leaf leaf-d" />
          <span className="bird-perch" />
        </div>

        <div className="tree tree-right">
          <span className="trunk" />
          <span className="leaf leaf-a" />
          <span className="leaf leaf-b" />
          <span className="leaf leaf-c" />
          <span className="apple apple-a" />
          <span className="apple apple-b" />
          <span className="apple apple-c" />
        </div>

        <div className="barn" aria-hidden="true">
          <span className="barn-roof" />
          <span className="barn-body" />
          <span className="barn-door" />
          <span className="barn-cross barn-cross-a" />
          <span className="barn-cross barn-cross-b" />
          <span className="barn-window" />
          <span className="silo" />
        </div>

        <div className="hero-card">
          <p>Welcome to</p>
          <h1>Paper Farm</h1>
          <span>A handcrafted little world full of friendly animals and peaceful moments.</span>
          <a href="#animals">Explore the Farm</a>
        </div>

        <div className="animal cow" aria-label="Paper cow">
          <span className="cow-body" />
          <span className="cow-head" />
          <span className="cow-ear cow-ear-left" />
          <span className="cow-ear cow-ear-right" />
          <span className="cow-spot spot-one" />
          <span className="cow-spot spot-two" />
          <span className="cow-leg leg-one" />
          <span className="cow-leg leg-two" />
          <span className="cow-tail" />
          <span className="eye" />
        </div>

        <div className="animal sheep" aria-label="Paper sheep">
          <span className="sheep-wool wool-one" />
          <span className="sheep-wool wool-two" />
          <span className="sheep-wool wool-three" />
          <span className="sheep-face" />
          <span className="sheep-ear" />
          <span className="sheep-leg leg-one" />
          <span className="sheep-leg leg-two" />
          <span className="eye" />
        </div>

        <div className="animal chicken" aria-label="Paper chicken">
          <span className="chicken-body" />
          <span className="chicken-head" />
          <span className="comb" />
          <span className="beak" />
          <span className="wing" />
          <span className="chicken-leg leg-one" />
          <span className="chicken-leg leg-two" />
        </div>

        <div className="animal pig" aria-label="Paper pig">
          <span className="pig-body" />
          <span className="pig-head" />
          <span className="pig-snout" />
          <span className="pig-ear" />
          <span className="pig-leg leg-one" />
          <span className="pig-leg leg-two" />
          <span className="eye" />
        </div>

        <div className="animal horse" aria-label="Paper horse">
          <span className="horse-body" />
          <span className="horse-neck" />
          <span className="horse-head" />
          <span className="horse-mane" />
          <span className="horse-tail" />
          <span className="horse-leg leg-one" />
          <span className="horse-leg leg-two" />
          <span className="horse-leg leg-three" />
          <span className="eye" />
        </div>

        <div className="duck" aria-label="Paper duck">
          <span className="duck-body" />
          <span className="duck-head" />
          <span className="duck-beak" />
        </div>

        <div className="flower flower-one" />
        <div className="flower flower-two" />
        <div className="grass grass-one" />
        <div className="grass grass-two" />
        <div className="river" />
      </section>

      <section id="about" className="paper-section">
        <p className="eyebrow">About</p>
        <h2>A calm farm scene built from soft paper layers.</h2>
        <p>
          The whole page is styled like a cutout diorama, with textured paper,
          warm colors, rounded cardboard shapes, and gentle movement across the scene.
        </p>
      </section>

      <section id="animals" className="paper-section paper-grid-section">
        <p className="eyebrow">Animals</p>
        <h2>Small animated friends bring the farm to life.</h2>
        <div className="mini-grid">
          <span>Cow</span>
          <span>Horse</span>
          <span>Sheep</span>
          <span>Chicken</span>
          <span>Pig</span>
          <span>Duck</span>
        </div>
      </section>

      <section id="gallery" className="paper-section paper-grid-section">
        <p className="eyebrow">Gallery</p>
        <h2>Handmade details for an artistic, playful world.</h2>
        <div className="mini-grid">
          {galleryItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section id="contact" className="paper-section contact-section">
        <p className="eyebrow">Contact</p>
        <h2>Ready to wander through the farm?</h2>
        <a href="mailto:hello@paperfarm.test">Say hello</a>
      </section>
    </main>
  );
}
