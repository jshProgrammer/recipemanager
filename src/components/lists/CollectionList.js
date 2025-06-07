import CollectionCard from '../cards/CollectionCard.js'
import { Link } from 'react-router-dom';

export default function CollectionList({collections}) {
    return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
        {collections.map((collection, index) => (
            <Link
                    key={index}
                    to={`/collections/${encodeURIComponent(collection.collectionName)}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                <CollectionCard key={index} imageURL={collection.imageURL} collectionName={collection.collectionName} />
            </Link>
        ))}
    </div>
);
}