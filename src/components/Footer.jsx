export default function Footer() {
  const styles = {
    width: 30,
    height: 30
  }

  return (
    <footer>
      <p>Follow us on</p>
      <a href="https://www.facebook.com" ><img style={styles} src="./src/assets/Facebook.png" /></a>
      <a href="https://www.instagram.com" ><img style={styles} src="./src/assets/Instagram.png" /></a>
      <a href="https://tiktok.com/?lang=en"><img style={styles} src="./src/assets/Tiktok.png" /></a>
      <a href="https://www.twitter.com"><img style={styles} src="./src/assets/Twitter.png" /></a>
    </footer>
  )
}