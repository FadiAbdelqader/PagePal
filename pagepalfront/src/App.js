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
    const [imageData, setImageData] = useState([]);
    const [userId, setUserId] = useState('');

    const handleChangeUserId = (event) => {
        setUserId(event.target.value);
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const fetchStatistics = async () => {
        const option = {
            method: 'GET',
            responseType: 'blob',
        };

        try {
            const response = await fetch(`http://localhost:8080/getstatisticsbyuser?userId=${userId}`, option);
            if (response.ok) {
                const blob = await response.blob();
                const zip = new JSZip();
                const content = await zip.loadAsync(blob);

                const imagesDataTemp = [];
                for (const [fileName, fileData] of Object.entries(content.files)) {
                    if (!fileData.dir) {
                        const blob = await fileData.async("blob");
                        const src = URL.createObjectURL(blob);
                        imagesDataTemp.push(src); // Ajoute l'URL de l'image au tableau
                    }
                }

                setImageData(imagesDataTemp); // Met à jour l'état avec les URLs des images
            } else {
                console.error('Récupération des statistiques : ERREUR!');
            }
        } catch (error) {
            console.error(error.message);
        }
    }

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
                                       aria-label="Search" onChange={handleChangeUserId}/>
                                <button className="btn btn-warning my-2" type="submit" onClick={fetchStatistics}>Search</button>
                            </div>
                            {/* Afficher les images ici */}
                            {imageData.map((src, index) => (
                                <img key={index} src={src} alt={`Statistic ${index}`} style={{ width: "100%", marginTop: "10px" }}/>
                            ))}
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
    const [imageData, setImageData] = useState([]);
    const fetchStatistics = async () => {
        const option = {
            method: 'GET',
            responseType: 'blob',
        };

        try {
            const response = await fetch('http://localhost:8080/executescript', option);
            if (response.ok) {
                const blob = await response.blob();
                const zip = new JSZip();
                const content = await zip.loadAsync(blob);

                const descriptions = [
                    "Le graphique montre les cinq utilisateurs les plus actifs dans la critique de livres sur une plateforme. L'utilisateur 11676 est le plus prolifique avec plus de 300 critiques, suivi par les utilisateurs 35859 et 204864 avec environ 200 et 150 critiques respectivement. Les deux derniers utilisateurs sont légèrement en dessous de 150 critiques. Cela indique un engagement significatif dans la communauté de lecteurs et peut refléter leur influence sur les autres utilisateurs en termes de recommandations de livres.",
                    "Ce graphique en barres empilées représente les 10 catégories de livres les plus lues, réparties par tranches d'âge des lecteurs. Il est intitulé \"Les 10 catégories les plus lues en fonction de l'âge\".\n\nOn peut observer que la catégorie \"Fiction\" est la plus lue pour presque toutes les tranches d'âge, constituant la majorité des lectures dans chaque groupe. Les autres catégories représentent une petite portion des lectures, avec une présence légèrement plus marquée de \"Biography & Autobiography\" chez les 31-40 ans et les 41-50 ans, et de \"Juvenile Fiction\" chez les 16-21 ans.\n\nIl y a une diminution générale du nombre de notes avec l'âge, avec un pic pour les 31-40 ans. Les plus jeunes (10-15 ans) et les plus âgés (70 ans et plus) ont le moins de notes, ce qui peut refléter des différences dans le temps disponible pour lire ou dans l'utilisation de la plateforme qui a collecté ces données.",
                    "Ce graphique en barres présente le nombre de livres publiés par année pour les 10 principales catégories littéraires de 1930 à 2005. La fiction est clairement la catégorie la plus publiée sur toute la période, montrant une croissance régulière et atteignant son apogée dans les dernières années affichées.\n\nLes catégories \"Juvenile\" et \"Biography & Autobiography\" suivent, mais avec un nombre nettement inférieur à la fiction. Il y a une croissance notable dans presque toutes les catégories à partir des années 1960, avec une accélération dans les années 1990 et 2000.\n\nL'augmentation globale pourrait refléter des changements dans l'industrie de l'édition, comme l'essor de l'autoédition, l'augmentation de la demande de livres due à une alphabétisation améliorée ou à un intérêt culturel croissant pour certaines thématiques. Cela pourrait aussi être dû à une plus grande facilité de comptabilisation et de suivi des publications avec les technologies modernes.",
                    "Le graphique illustre le classement des 10 pays avec le plus grand nombre de critiques de livres. Les États-Unis dominent largement avec le plus grand nombre de critiques, suivis par le Canada, le Royaume-Uni, l'Allemagne, et l'Australie. L'Espagne, la France, l'Italie, le Portugal et la Nouvelle-Zélande complètent la liste, chacun avec un nombre considérablement plus bas de critiques par rapport aux premiers pays mentionnés. Cela suggère une forte activité dans le domaine des critiques de livres dans les pays anglophones, en particulier."
                ];

                const imageData = [];
                let index = 0;
                for (const [fileName, fileData] of Object.entries(content.files)) {
                    if (!fileData.dir) {
                        const blob = await fileData.async("blob");
                        const src = URL.createObjectURL(blob);
                        imageData.push({ src, description: descriptions[index++] });
                    }
                }

                setImageData(imageData);
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
                {imageData.map((data, index) => (
                    <div key={index} className="col-12 col-md-6 mb-4">
                        <div className="card h-100">
                            <img src={data.src} alt={`Book Statistics ${index + 1}`} className="card-img-top" style={{maxHeight: '600px', width: '100%', objectFit: 'contain'}} />
                            <div className="card-body">
                                <h5 className="card-title">Image {index + 1}</h5>
                                <p className="card-text">{data.description}</p>
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

function DynamicBookStatisticsModal({ onClose }) {
    const [bookName, setBookName] = useState('');
    const [resultat, setResultat] = useState('');

    const handleChangeBookName = (event) => {
        setBookName(event.target.value);
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const fetchStatistics = async () => {
        try {
            // Construisez correctement l'URL avec bookName
            const url = `http://localhost:8080/getBookInfos/${encodeURIComponent(bookName)}`;
            const response = await fetch(url); // Supprimez 'option', car il est mal configuré
            if (response.ok) {
                const result = await response.text();
                setResultat(result); // Met à jour le state avec le résultat
            } else {
                console.error('Récupération des statistiques : ERREUR!');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="modal fade show" id="userStatisticsModal" tabIndex="-1" role="dialog"
             aria-labelledby="userStatisticsModalLabel" aria-hidden="true" style={{ display: 'block' }} onClick={onClose}>
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
                                       aria-label="Search" onChange={handleChangeBookName}/>
                                <button className="btn btn-warning my-2" type="submit" onClick={fetchStatistics}>Search</button>
                            </div>
                            {resultat &&
                                <div className="mt-3">
                                    <div className="card">
                                        <div className="card-header">
                                            Résultats de la recherche
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">Détails du livre</h5>
                                            <p className="card-text" style={{whiteSpace: 'pre-wrap'}}>{resultat}</p>
                                        </div>
                                    </div>
                                </div>
                            }                        </div>
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


