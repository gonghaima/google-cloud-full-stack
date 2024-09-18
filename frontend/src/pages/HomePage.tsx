

type Props = object;

// eslint-disable-next-line no-empty-pattern
function HomePage({}: Props) {
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img
            src="https://www.coolseotools.com/placeholder/600x300/D5D5D5/584959"
            className="logo"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src="https://www.coolseotools.com/uploads/Coolseotools-logo.png?ezimgfmt=ng%3Awebp%2Fngcb1%2Frs%3Adevice%2Frscb1-1"
            className="logo react"
            alt="React logo"
          />
        </a>
      </div>
      <h1>Vite + React + Google Cloud Host</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default HomePage;
