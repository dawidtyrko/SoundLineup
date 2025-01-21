import Link from "next/link";
import classes from "./ArtistList.module.css"
import Image from "next/image";
const LocalList = ({locals}) => {
    return (
        <ul className={classes.artistList}>
            {locals.map(local =>(
                <li key={local._id} className={classes.artistListLi}>
                    <div className={classes.artistDetails}>
                        {local.profileImage && (
                            <Image src={`http://localhost:3001/${local.profileImage}`} alt={local.name} className={classes.artistImage}
                                   width={50} height={50}/>
                        )}
                        <Link href={`/locals/${local._id}`}>{local.name}</Link>
                    </div>
                </li>
            ))}
        </ul>
    )
}
export default LocalList;