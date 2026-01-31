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

export default function ColourFinder(){
    const [colour, setColour] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [colourData, setColourData] = useState<ColourData | null>(null);
    const [isColourLight, setIsColourLight] = useState<boolean>(false);

    async function findColour(): Promise<void>{
        const normalisedText = colour.trim().replace(/\s+/g,"");
        if(normalisedText === "" || normalisedText === colourData?.keyword.toLowerCase()){
            return;
        }
        setIsError(false);
        setColourData(null);
        setIsLoading(true);
        try{
            const encodedInputText = encodeURIComponent(normalisedText);
            const response = await fetch(`http://localhost/colourFinderProxy/proxyServer.php?colour=${encodedInputText}`);
            if(!response.ok){
                throw new Error("Could not retrieve colour.");
            }
            const data: ApiResponse = await response.json();
            setColourData({
                keyword: data.data.name,
                rgbValue: data.data.rgb
            });
            changeRgbTextColour(data.data.rgb);
        }
        catch(_){
            setIsError(true);
        }
        finally{
            setIsLoading(false);
        }
    }

    function changeRgbTextColour(rgbText: string): void{
        const [r, g, b] = rgbText.match(/\d+/g)?.map(Number) ?? [0, 0, 0];
        //Luminance formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setIsColourLight(brightness > lightThreshold);
    }

    function findOnEnterKey(e: React.KeyboardEvent<HTMLInputElement>): void{
        if(e.key === "Enter"){
            findColour();
        }
    }

    const messages = {
        intro: (
            <p className="message-text">
                Please input the name of your colour.
            </p>
        ),
        loading: (
            <SyncLoader 
                size={5} 
                color="var(--text-color)" 
                style={{paddingTop: "5rem"}}
            />
        ),
        error: (
            <p className="message-text error-message"> 
                Could not find this colour. Please choose another or try again later.
            </p>
        ),
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
                    >
                        Find
                    </button>
                </div>
            </div>
            
            <div className="result-container">
                {!isLoading && !isError && !colourData && messages.intro}
                {isLoading && !isError && messages.loading}
                {!isLoading && isError && messages.error}

                {colourData && !isError && !isLoading &&
                    <div>
                        <h2>{colourData.keyword.replace(/([A-Z])/g, ' $1').trim()}</h2>
                        <div className="colour-container" style={{backgroundColor: `rgb(${colourData.rgbValue})`}}>
                            <p style={{color: isColourLight ? darkText : lightText}}>
                                rgb({colourData.rgbValue})
                            </p>
                        </div>
                    </div>  
                }
            </div>
        </main>
    );
}