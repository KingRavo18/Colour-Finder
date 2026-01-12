import { useState } from "react";


export default function ColourFinder(){
    const [colour, setColour] = useState("");

    return(
        <div className="colour-finder-container">
            <div className="colour-input-container">
                <label>
                    Input Colour Name:
                    <input type="text"
                           value={colour}
                           onChange={e => setColour(e.target.value)}
                           title="Input the name of the colour you wish to display"
                    />
                </label>
                <button>Find</button>
            </div>
        </div>
    );
}