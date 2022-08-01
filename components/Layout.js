import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Header />
      {
        // content of the page
        props.children
      }
      <Footer />
    </>
  );
}
