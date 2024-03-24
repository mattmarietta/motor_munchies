import styles from './NavBar.module.css'
import SearchBar from './SearchBar.jsx'

export default function NavBar() {
  return (
    <div className={styles.navbar}>
      <h2>motor munchies</h2>
      <a className="btn" href="./index.html">Home</a>
      <a className="btn" href="./login.html">Sign in</a>
      <SearchBar width="200px"/>
    </div>
  );
}