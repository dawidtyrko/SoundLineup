import Link from 'next/link'
import classes from './ArtistList.module.css'
import Image from "next/image";
const ArtistList = ({artists, onArtistClick}) =>{
    return (
            <ul className={classes.artistList}>
                {artists.map(artist => (
                    <li key={artist._id} className={classes.artistListLi}>
                        <div className={classes.artistDetails}>
                            {artist.profileImage && (
                                <Image src={`http://localhost:3001/${artist.profileImage}`} alt={artist.name} className={classes.artistImage}
                                       width={50} height={50}/>
                            )}
                        <Link href={`/artists/${artist._id}`} className={classes.artistName} onClick={() =>onArtistClick(artist._id)}>{artist.name}</Link>
                        </div>
                    </li>
                ))}
            </ul>
    );
}
export default ArtistList;