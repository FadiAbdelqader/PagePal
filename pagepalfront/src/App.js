import "bootstrap/dist/css/bootstrap.min.css";
import {useState} from "react";
import JSZip from 'jszip';

export default function App() {
    // État pour contrôler l'affichage du modal
    const [showUserStatsModal, setShowUserStatsModal] = useState(false);
    const [showBookStatsModal, setShowBookStatsModal] = useState(false);
    const [showCountryStatsModal, setShowCountryStatsModal] = useState(false);

    // Fonction pour ouvrir le modal
    const handleOpenUserStatsModal = () => {
        setShowUserStatsModal(true);
    };

    // Fonction pour fermer le modal
    const handleCloseUserStatsModal = () => {
        setShowUserStatsModal(false);
    };

    const handleOpenBookStatsModal = () => {
        setShowBookStatsModal(true);
    }

    const handleCloseBookStatsModal = () => {
        setShowBookStatsModal(false);
    }

    const handleOpenCountryStatsModal = () => {
        setShowCountryStatsModal(true);
    }

    const handleCloseCountryStatsModal = () => {
        setShowCountryStatsModal(false);
    }

    return (
        <div className="App container mt-5">

            <StaticBooksStatisticsButton/>
            <center>
                <div className="row">
                    <div className="col-md-4">
                        <DynamicUserStatisticsButton onClick={handleOpenUserStatsModal}/>
                    </div>
                    <div className="col-md-4">
                        <DynamicBookStatisticsButton onClick={handleOpenBookStatsModal}/>
                    </div>
                    <div className="col-md-4">
                        <DynamicCountryStatisticsButton onClick={handleOpenCountryStatsModal}/>
                    </div>
                </div>
            </center>
            {showUserStatsModal && <DynamicUserStatisticsModal onClose={handleCloseUserStatsModal}/>}
            {showBookStatsModal && <DynamicBookStatisticsModal onClose={handleCloseBookStatsModal}/>}
            {showCountryStatsModal && <DynamicCountryStatisticsModal onClose={handleCloseCountryStatsModal}/>}
            <SearchBookByPreference/>
            <SearchBookByDescription/>
        </div>
    );
}


function DynamicUserStatisticsButton({onClick}) {
    return (
        <button className="btn btn-warning" onClick={onClick}>User Statistics</button>
    );
}


function DynamicUserStatisticsModal({onClose}) {
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal fade show" id="userStatisticsModal" tabIndex="-1" role="dialog"
             aria-labelledby="userStatisticsModalLabel" aria-hidden="true" style={{display: 'block'}} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document"
                 onClick={handleModalContentClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="userStatisticsModalLabel">User Statistics</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="my-4">
                            <h3 className="text-dark">Search for a user statistic</h3>
                            <div className="d-flex flex-wrap justify-content-center">
                                <input className="form-control me-2" type="search" placeholder="Search"
                                       aria-label="Search"/>
                                <button className="btn btn-warning my-2" type="submit">Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    );
}

function StaticBooksStatisticsButton() {
    const [imageSrcs, setImageSrcs] = useState([]);

    const fetchStatistics = async () => {
        const option = {
            method: 'GET',
            responseType: 'blob', // Important pour recevoir le contenu binaire de la réponse
        };

        try {
            const response = await fetch('http://localhost:8080/executescript', option);
            if (response.ok) {
                const blob = await response.blob();
                const zip = new JSZip();
                const content = await zip.loadAsync(blob);

                const imageSrcs = [];
                for (const [fileName, fileData] of Object.entries(content.files)) {
                    if (!fileData.dir) {
                        const blob = await fileData.async("blob");
                        const src = URL.createObjectURL(blob);
                        imageSrcs.push(src);
                    }
                }

                setImageSrcs(imageSrcs);
            } else {
                console.error('Récupération des statistiques : ERREUR!');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <div className="my-3">
            <button className="btn btn-warning w-100" onClick={fetchStatistics}>Books Statistics</button>
            <div className="row mt-3">
                {imageSrcs.map((src, index) => (
                    <div key={index} className="col-12 col-md-6 mb-4">
                        <div className="card h-100">
                            <img src={src} alt={`Book Statistics ${index}`} className="card-img-top" style={{maxHeight: '600px', width: '100%', objectFit: 'contain'}} />
                            <div className="card-body">
                                <h5 className="card-title">Image {index + 1}</h5>
                                <p className="card-text">Description de l'image {index + 1}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}



function DynamicBookStatisticsButton({onClick}) {
    return (
        <>
            <button className="btn btn-warning" onClick={onClick}>Book Statistics</button>
        </>
    )
}

function DynamicBookStatisticsModal({onClose}) {
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal fade show" id="userStatisticsModal" tabIndex="-1" role="dialog"
             aria-labelledby="userStatisticsModalLabel" aria-hidden="true" style={{display: 'block'}} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document"
                 onClick={handleModalContentClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="userStatisticsModalLabel">User Statistics</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="my-4">
                            <h3 className="text-dark">Search for a book statistic</h3>
                            <div className="d-flex flex-wrap justify-content-center">
                                <input className="form-control me-2" type="search" placeholder="Search"
                                       aria-label="Search"/>
                                <button className="btn btn-warning my-2" type="submit">Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    );
}

function DynamicCountryStatisticsButton({onClick}) {
    return (
        <>
            <button className="btn btn-warning" onClick={onClick}>Country Statistics</button>
        </>
    )
}

function DynamicCountryStatisticsModal({onClose}) {
    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="modal fade show" id="userStatisticsModal" tabIndex="-1" role="dialog"
             aria-labelledby="userStatisticsModalLabel" aria-hidden="true" style={{display: 'block'}} onClick={onClose}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document"
                 onClick={handleModalContentClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="userStatisticsModalLabel">User Statistics</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                                onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="my-4">
                            <h3 className="text-dark">Search for a country statistic</h3>
                            <div className="d-flex flex-wrap justify-content-center">
                                <input className="form-control me-2" type="search" placeholder="Search"
                                       aria-label="Search"/>
                                <button className="btn btn-warning my-2" type="submit">Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                    </div>
                </div>
            </div>
        </div>
    );
}

function SearchBookByPreference() {
    return (
        <div className="my-4">
            <h1 className="text-dark">Search for a book from a book you liked</h1>
            <div className="d-flex flex-wrap justify-content-center">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-warning my-2" type="submit">Search</button>
            </div>
        </div>
    )
}

function SearchBookByDescription() {
    return (
        <div className="my-4">
            <h1 className="text-dark">Search for a book by description</h1>
            <div className="d-flex flex-wrap justify-content-center">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-warning my-2" type="submit">Search</button>
            </div>
        </div>
    )
}


