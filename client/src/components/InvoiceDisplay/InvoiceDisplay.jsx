import './InvoiceDisplay.scss'
import logo from '../../assets/images/ducklogo.png'

const InvoiceDisplay = (props)=>{
    return <div className="InvoiceDisplay">
        <div className="row">
            <div className="col-4 col-sm-3">
                <img src={logo} alt="" className="logo" />
            </div>
            <div className="col-8 col-sm-9">
                <div className="row">
                    {props.transationType}
                </div>
            </div>
        </div>
    </div>
}

export default InvoiceDisplay;