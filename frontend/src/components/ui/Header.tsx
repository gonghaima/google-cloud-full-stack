import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="container">
      <div className="heading">
        <h1>
          {/* <a href="/">Forum App</a> */}
          Forum App
        </h1>
      </div>

      <div className="gradient-container">
        <div className="gradient-line gradient-line-blur"></div>
        <div className="gradient-line gradient-line-thin"></div>
        <div className="gradient-line gradient-line-sky-blur"></div>
        <div className="gradient-line gradient-line-sky"></div>
      </div>
    </div>
  );
};
export default Header;
