import { SyncLoader } from "react-spinners";

export default function LoadingSpinner(){
    return(
        <SyncLoader 
            size={5} 
            color="var(--text-color)" 
            style={{paddingTop: "5rem"}}
        />
    )
}
