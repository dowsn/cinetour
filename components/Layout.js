import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Header
        image={props.image}
        refreshUserProfile={props.refreshUserProfile}
      />
      {
        // content of the page
        props.children
      }
      <Footer />
    </>
  );
}
