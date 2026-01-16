import { useState } from "react";

export default function ColourFinder(){
    const [colour, setColour] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [colourData, setColourData] = useState<null>(null);

    function findColour(): void{
        try{
            setIsLoading(true);
            setIsLoading(false);
        }
        catch(error){
            setIsError(true);
        }
    }

    const messages = {
        intro: <p className="message-text">Please input the name of your colour</p>,
        loading: <p className="message-text">Loading...</p>,
        error: <p className="message-text error-message"> Could not find this colour. Please choose another or try again later.</p>
    }

    return(
        <main>
            <h1>Colour Finder</h1>
            <div className="colour-input-container">
                <label htmlFor="colour-input">Input Colour Name:</label>
                <div>
                    <input type="text"
                        value={colour}
                        id="colour-input"
                        onChange={e => setColour(e.target.value)}
                        title="Input the name of the colour you wish to display"
                    />
                    <button onClick={findColour}
                            title="Find the colour"
                            aria-label="Press to find the colour"
                    >
                        Find
                    </button>
                </div>
            </div>
            
            <div className="result-container">
                {!isLoading && !isError && messages.intro}
                {isLoading && !isError && messages.loading}
                {!isLoading && isError && messages.error}

                {colourData && !isError && !isLoading &&
                    <div></div>  
                }
            </div>
        </main>
    );
}