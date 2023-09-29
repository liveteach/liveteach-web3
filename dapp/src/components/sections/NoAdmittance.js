import noAdmittance from "../../images/noAdmittance.png";

export function NoAdmittance(){
    return (
        <div style={{margin: '10%'}}>
            <h3 src={noAdmittance} style={{margin: 'auto auto', textAlign: 'center'}}>You are not permitted to view this page</h3>
            <img alt="no img" src={noAdmittance} style={{opacity: 0.2, marginLeft:'10%'}}/>
        </div>
    )
}