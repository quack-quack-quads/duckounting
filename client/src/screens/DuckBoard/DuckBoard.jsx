import "./DuckBoard.scss"

const DuckBoard = () => {
    return <div className="DuckBoard">
        <div className="topbanner row">
            {/* for showing credentials */}
            <div className="col-12 col-md-6 col-lg-5 credcol">
                <div className="credbox">
                    <div className="row">
                        <div className="col-8">
                            <div className="row credrow">
                                Duckingworth Webfeet
                            </div>
                            <div className="row credrow yellowtext">
                                DUCKS6969D
                            </div>
                        </div>
                        <div className="col-4 centercol">
                            <button className="btn btn-sm btn-warning">
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col"></div>
        </div>
        <div className="row cardrow">
            <div className="d-none d-md-block col-md-7 col-lg-8"></div>
            <div className="col-12 col-md-5 col-lg-4 createcardcol">
                <div className="createcard">
                </div>
            </div>
        </div>
    </div>
}

export default DuckBoard;