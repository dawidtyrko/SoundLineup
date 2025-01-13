import Link from 'next/link'

const ArtistList = ({artists}) =>{
    return (
            <ul>
                {artists.map(artist => (
                    <li key={artist._id}>
                        <Link href={`/artists/${artist._id}`}>{artist.name}</Link>
                    </li>
                ))}
            </ul>
    );
}
export default ArtistList;