export function SpecialActionsSection(props){

    return (
        <div className="ui container" style={{backgroundColor: '#37333d', padding: '20px', borderRadius: "10px"}} >
            <h4>Custom JSON</h4>
          <textarea
              value={props.inputText}
              onChange={props.handleInputChange}
              placeholder="Paste JSON here..."
              rows="10"
              cols="50"
              style={{width: '100%'}}
          />
        </div>
    );
}