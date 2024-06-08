import React, { useState, useRef } from 'react';
import InputLabel from '../../components/InputLabel';
import InvalidFeedback from '../../components/InvalidFeedback';

function ImageUploadPreview({ data = null, setData, errors, defaultImage = null }) {

    const [previewUrl, setPreviewUrl] = useState(defaultImage);
    const inputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            if (data !== null) {
                setData({
                    ...data,
                    remove_old_image: false,
                    image: file
                });
            } else {
                setData('image', file);
            }
        }
    };

    const handleRemoveImage = () => {
        if (data !== null) {
            if (defaultImage != null) {
                setData({
                    ...data,
                    remove_old_image: true,
                    image: undefined
                });
            } else {
                setData({
                    ...data,
                    image: undefined
                });
            }
        } else {
            setData('image', undefined);
        }

        setPreviewUrl(null);
        if (inputRef.current) {
            inputRef.current.value = '';  // Clear the input value
        }
    };

    return (
        <div>
            <InputLabel label={"Images"} />
            {previewUrl && (
                <div style={styles.previewContainer} className='mb-3'>
                    <img src={previewUrl} alt="Image Preview" style={styles.image} />
                    <button onClick={handleRemoveImage} style={styles.button}>Remove Image</button>
                </div>
            )}
            <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputRef}  // Attach the reference to the input element
            />
            {errors.image && <InvalidFeedback errorMsg={errors.image} />}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
    },
    previewContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px',
    },
    image: {
        border: '1px solid #ddd',
        padding: '5px',
        borderRadius: '4px',
        maxWidth: '200px',
        maxHeight: '100%',
        marginBottom: '10px',
    },
    button: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
};

export default ImageUploadPreview;
