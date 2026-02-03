import { useState } from "react";
import { SyncLoader } from "react-spinners";

type ColourData = {
    keyword: string;
    rgbValue: string;
}

type ApiResponse = {
    data: {
        name: string,
        rgb: string 
    }
}

const lightThreshold = 155;
const lightText = "white";
const darkText = "rgb(24, 24, 24)";

function IntroMessage(){
    return (
        <p className="message-text">
            Please input the name of your colour.
        </p>
    )
}

function ErrorMessage(){
    return (
        <p className="message-text error-message"> 
            Could not find this colour. Please choose another or try again later.
        </p>
    )
}

function LoadingSpinner(){
    return(
        <SyncLoader 
            size={5} 
            color="var(--text-color)" 
            style={{paddingTop: "5rem"}}
        />
    )
}

export default function ColourFinder(){
    const [colour, setColour] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [colourData, setColourData] = useState<ColourData | null>(null);

    async function findColour(): Promise<void>{
        const normalisedText = colour.trim().replace(/\s+/g,"");
        if(normalisedText === "" || normalisedText === colourData?.keyword.toLowerCase()){
            return;
        }
        setIsError(false);
        setIsLoading(true);
        try{
            const response = await fetch(`./api/colour.js?colour=${encodeURIComponent(normalisedText)}`);
            if(!response.ok){
                throw new Error("Could not retrieve colour.");
            }
            const data: ApiResponse = await response.json();
            setColourData({
                keyword: data.data.name,
                rgbValue: data.data.rgb
            });
            
        }
        catch(_){
            setColourData(null);
            setIsError(true);
        }
        finally{
            setIsLoading(false);
        }
    }

    function isColourLight(rgbText: string): boolean{
        const [r, g, b] = rgbText.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
        //Luminance formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > lightThreshold;
    }

    function findOnEnterKey(e: React.KeyboardEvent<HTMLInputElement>): void{
        if(e.key === "Enter" && !isLoading){
            findColour();
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
                        onKeyDown={findOnEnterKey}
                        title="Input the name of the colour you wish to display"
                        autoComplete="off"
                        autoFocus
                    />
                    <button onClick={findColour}
                            title="Find the colour"
                            aria-label="Press to find the colour"
                            disabled={isLoading}
                    >
                        Find
                    </button>
                </div>
            </div>
            
            <div className="result-container">
                {!isLoading && !isError && !colourData && <IntroMessage />}
                {isLoading && <LoadingSpinner />}
                {!isLoading && isError && !colourData && <ErrorMessage />}

                {!isLoading && !isError && colourData && 
                    <div>
                        <h2>{colourData.keyword.replace(/([A-Z])/g, ' $1').trim()}</h2>
                        <div className="colour-container" style={{backgroundColor: `rgb(${colourData.rgbValue})`}}>
                            <p style={{color: isColourLight(colourData.rgbValue) ? darkText : lightText}}>
                                rgb({colourData.rgbValue})
                            </p>
                        </div>
                    </div>  
                }
            </div>
        </main>
    );
}