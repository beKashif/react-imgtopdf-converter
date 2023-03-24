import React, { useState } from 'react'
import './ImgtoPdf.css'
import jsPDF from 'jspdf'

const ImgtoPdf = () => {
    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState('')
    const [imageSelected, setImageSelected] = useState(false)

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setImageSelected(true);
    }
    const handleFileNameChange = (e) => {
        setFileName(e.target.value)
    }
    const convertToPdf = () => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            const pdf = new jsPDF('p', 'mm', [img.width, img.height]);

            // chech if the image width is greater then pdf page width

            if(img.width > pdf.internal.pageSize.getWidth()) {
                const ratio = pdf.internal.pageSize.getWidth() / img.width;
                const height = img.height * ratio;
                pdf.addImage(image, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), height);
            } else {
                pdf.addImage(image, 'JPEG', 0, 0, img.width, img.height);
            }

            const filename = fileName === '' ? 'mypdf.pdf' : `${fileName}.pdf`;
            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.click();

            // lets clean up all the sections after download is start

            setTimeout(() => {
                URL.revokeObjectURL(url);
                setImage(null);
                setFileName('');
                setImageSelected(false);
            }, 1000);
        }
    }

    return (
        <>
            <div className="mycontainer">
                <h1 className='main-title'>ReactJs 💲💲💲 Project</h1>
                <div className='subContainer'>
                    <p className='title'>Image to Pdf Converter</p>
                    <div className='input-container'>
                        <div className='custom-file-input-container'>
                            <label htmlFor='file-input' className='custom-file-input'></label>
                            <input id='file-input' type='file' accept='image/*' className='mainInput' onChange={handleImageChange} />
                        </div>

                        {imageSelected && (

                            <>
                                <div className='preview-container'>
                                    <img className='preview-image' alt="Selected" src={image}/>
                                </div>
                                
                                <div className="newDiv">
                                <div className='file-name-input-container'>
                                    <input placeholder='enter file name' id='file-name-input' type='text' value={fileName} onChange={handleFileNameChange}/>
                                </div>

                                <button className='convert-button' onClick={convertToPdf}>Download Pdf</button>
                                </div>
                            </>


                        )}

                    </div>
                </div>
            </div>
        </>
    )
}

export default ImgtoPdf