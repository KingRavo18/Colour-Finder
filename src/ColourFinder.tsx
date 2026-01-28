import { useState } from "react";
import { SyncLoader } from "react-spinners";

type ColourData = {
    keyword: string;
    rgbValue: string;
}

type ApiResponse = {
    base: {
        keyword: string,
        rgb: { value: string }
    }
}

export default function ColourFinder(){
    const [colour, setColour] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [colourData, setColourData] = useState<ColourData | null>(null);

    async function findColour(): Promise<void>{
        if(colour.trim() === ""){
            return;
        }
        setColourData(null);
        setIsLoading(true);
        try{
            const response = await fetch(`/api/keyword=${colour}`);
            if(!response.ok){
                throw new Error("Could not retrieve colour.");
            }
            const data: ApiResponse = await response.json();
            const keyword = data.base.keyword;
            setIsError(false);
            setColourData({
                keyword: keyword.at(0)?.toUpperCase() + keyword.slice(1),
                rgbValue: data.base.rgb.value
            });
        }
        catch(error){
            setIsError(true);
        }
        finally{
            setIsLoading(false);
        }
    }

    const messages = {
        intro: <p className="message-text">Please input the name of your colour.</p>,
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
                {!isLoading && !isError && !colourData && messages.intro}
                {isLoading && !isError && <SyncLoader size={5} color="var(--text-color)" style={{paddingTop: "5rem"}}/>}
                {!isLoading && isError && messages.error}

                {colourData && !isError && !isLoading &&
                    <div>
                        <h2>{colourData.keyword}</h2>
                        <div className="colour-container" style={{backgroundColor: colourData.rgbValue}}>
                            <p>{colourData.rgbValue}</p>
                        </div>
                    </div>  
                }
            </div>
        </main>
    );
}