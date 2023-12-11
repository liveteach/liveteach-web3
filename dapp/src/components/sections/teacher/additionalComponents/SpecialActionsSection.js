import {Button} from "@mui/material";
import {useState} from "react";

export function SpecialActionsSection(props){

    const [text, setText] = useState("")

    return (
        <div className="ui container" style={{backgroundColor: '#37333d', padding: '20px', borderRadius: "10px"}} >
            <h4>Custom JSON</h4>
              <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste JSON here..."
                  rows="10"
                  cols="50"
                  style={{width: '100%'}}
              />
            <Button
                variant="contained"
                onClick={() => props.handleInputChange(text)}
            >Add</Button>
        </div>
    );
}