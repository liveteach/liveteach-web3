import Header from "../layout/Header";
import Footer from "../layout/Footer";

export function FAQ(props){

    return(
        <>
            <Header authenticated />
            <div className="dcl tabs" />
                <main>
                    <div className="ui container">
                        <p> Hello im the FAQ Page</p>
                    </div>
                </main>
            <Footer />
        </>
    )
}