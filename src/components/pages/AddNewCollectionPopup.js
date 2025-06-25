import { useEffect, useState } from "react";
import ImagePicker from "../subcomponents/ImagePicker";
import {storeOwnCollectionInDB} from '../../features/databaseStorage/ownCollectionsStorage.js'
import {uploadImage} from '../../features/databaseStorage/imageStorage.js'
import {useAuth} from "../../features/providers/AuthContext";
import {storeFavoriteCollectionInDB} from '../../features/databaseStorage/favoriteRecipesStorage'

const AddNewCollectionPopup = ({isOpen, isOwnRecipe, onClose,  setParentMessage, setParentMessageType, reloadCollections}) => {
    const { user } = useAuth();
    const [collectionName, setCollectionName] = useState();
    const [image, setImage] = useState();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'unset';
        }
        return () => {
          document.body.style.overflow = 'unset';
        };
      }, [isOpen]);

    useEffect(() => {
        const handleEsc = (event) => {
        if (event.keyCode === 27) {
            onClose();
        }
        };
        
        document.addEventListener('keydown', handleEsc);
            return () => {
            document.removeEventListener('keydown', handleEsc);
            };
    }, [onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    const storeCollection = async (e) => {
        e.preventDefault();
        setParentMessage(null);
        setParentMessageType(null);
        setIsLoading(true);
        try {
          var imageURL = await uploadImage(image);
          console.log(imageURL);

          if(isOwnRecipe) await storeOwnCollectionInDB({userID: user.uid, customCollection: {
              imageURL: imageURL,
              collectionName: collectionName
          }});
          else await storeFavoriteCollectionInDB({userID: user.uid, customCollection: {
                imageURL: imageURL, collectionName: collectionName
            }});
          onClose();

          reloadCollections();
          setParentMessage("Collection " + collectionName + " stored successfully!");
          setParentMessageType("success");
          setTimeout(() => {
              setParentMessage(null);
              setParentMessageType(null);
              onClose();
          }, 5000);
        } catch(err) {
          setParentMessage("Error when storing collection: " + err.message);
          setParentMessageType("error");
        }
        setIsLoading(false);
    }
    
    if (!isOpen) return null;

    return (
      
     <div
      className="position-fixed h-100 w-100 d-flex align-items-center justify-content-end"
      style={{
        zIndex: 9999,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={handleBackdropClick}>
        
        <div className="bg-white rounded-5 shadow-lg position-relative"
        style={{
          zIndex: 10000,
          maxWidth: '400px',
          width: '100%',
          marginRight: "50px",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: '2rem',
          borderBottomLeftRadius: '2rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        onClick={e => e.stopPropagation()}>
            <div className="p-4 d-flex flex-column align-items-center justify-content-center">
                <h2 className="green">Add new collection</h2>

                <div style={{ width: "100%" }}>
                    <div className="d-flex justify-content-center mb-3">
                        <ImagePicker image={image} onImageChange={setImage}/>
                    </div>

                    <form onSubmit={storeCollection}>
                        <div className="mb-3 mt-3">
                            <label className="form-label fw-medium text-dark w-100">
                            Collection Name
                            </label>
                            <input type="text"
                            name="collectionName"
                            value={collectionName}
                            onChange={e => {setCollectionName(e.target.value)}}
                            placeholder="Enter your new collection name"
                            className="form-control"/>

                            {isLoading ? (
                              <div className="d-flex justify-content-center mt-3">
                                <div className="spinner-border text-success" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>
                            ) : (
                            <button type="submit"
                                className="btn mt-3 backgroundGreen py-3 fw-medium w-100">Save</button>)}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}

export default AddNewCollectionPopup;