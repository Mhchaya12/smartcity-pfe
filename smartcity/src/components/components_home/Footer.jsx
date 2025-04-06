import React from'react';
import {Link} from  'react-router-dom';
import './Footer.css';

const Footer= () =>{
    return (
        <footer className='footer'>
            <div className='footer-container'>
                <div className='footer-section'>
                    <h3>Smart City</h3>
                    <p>solution complete de gestion pour administrateur , analystes et techniciens .</p>
                </div>
                <div className='footer-section'>
                    <h3>Liens rapides</h3>
                    <ul>
                        <li><Link to='/'>Accueil</Link></li>
                    </ul>
                </div>
                <div className='footer-section'>
                    <h3>Support</h3>
                    <ul>
                        <li>politique de confidentialité</li>
                        <li>termes d'utilisation</li>
                    </ul>
                </div>
                <div className='footer-section'>
                    <h3>Contact</h3>
                    <ul>
                        <li>(+216) 58 889 270</li>
                        <li>
                            <a href="https://ici-code.vercel.app/" target="_blank" rel="noopener noreferrer">
                                https://ici-code.vercel.app/
                            </a>
                        </li>
                    </ul>
                </div>


            </div>
            <div className='footer-bottom'>
                <p>&copy; {new Date().getFullYear()} NomPlateforme. Tous droits réservés.</p>
            </div>

        </footer>
    );
};
export default Footer;