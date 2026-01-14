import { useState } from "react";

export default function ColourFinder(){
    const [colour, setColour] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    function findColour(): void{
        try{
            setIsLoading(true);
            setIsLoading(false);
        }
        catch(error){
            setIsError(true);
        }
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

            {!isLoading && !isError &&
                <p className="message-text">
                    Please input the name of your colour
                </p>
            }

            {isLoading && !isError &&
                <p className="message-text">
                    Loading...
                </p>
            }

            {!isLoading && isError &&
                <p className="message-text error-message">
                    Could not find this colour. Please choose another or try again later.
                </p>
            }

            <div>

            </div>
        </main>
    );
}