import React, {useEffect, useState} from 'react'
import Banner from "./Banner";
import Features from "./Features";
import About from "./About";
import Features_two from "./Features_two";
import Header from "./Header";
import Blockquote from "./Blockquot";
import PageNotFound from "./PageNotFound";


function Home() {
    const [visible, setVisible] = useState(false);
    const [show, setshow] = useState(false);

    useEffect(()=>{
        if (window.innerWidth < 1080){
            setshow(true)
        }
    },[])


    return (
        <>
            {show ? <PageNotFound /> :
                <div className="home">
                    <Header/>
                    <Banner/>
                    <Blockquote/>
                    <Features/>
                    <About setVisible={setVisible}/>
                    {visible &&
                        <Features_two/>
                    }
                </div>
            }

        </>
    )
}

export default Home
