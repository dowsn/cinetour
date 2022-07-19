import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      {/* passing the refreshing user and the state to the header */}
      <Header user={props.user} />
      {
        // content of the page
        props.children
      }
      <Footer />
    </>
  );
}
