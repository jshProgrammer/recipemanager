import Collection from './Collection.js'

export default function CollectionList({collections}) {
    return (
    <div className="d-flex flex-wrap gap-4 justify-content-center">
        {collections.map((collection, index) => (
        <Collection key={index} {...collection} />
        ))}
    </div>
);
}