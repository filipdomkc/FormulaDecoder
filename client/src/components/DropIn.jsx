import React,{useState} from 'react';
import axios from 'axios';
import {useDropzone} from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';

function DropIn(props) {

  const [response, setResponse] = useState(null);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onDrop = async (acceptedFiles) => {
    // Ensure that dropped file is in PNG format
    if (acceptedFiles.length > 0 ) {
      const imageUrl = URL.createObjectURL(acceptedFiles[0]);
      setImage(imageUrl);

      // Prepare data for POST request
      const formData = new FormData();
      formData.append("image", acceptedFiles[0]);

      try {
        // Send POST request with Axios
        const response = await axios.post(process.env.REACT_APP_API_URL, formData);

        console.log("File uploaded successfully!", response);
        setResponse(response.data.result); // Set the response data on the frontend
        setErrorMessage(null);

      } catch (error) {
        console.error("Error uploading file!", error);
        setResponse(null); // Clear the response data on the frontend
        setErrorMessage("Could not read the image. Please, try again!");
      }
    };
  }

  const displayImage = image ? (
    <div>
      <h3 className='text-white'>Dropped image:</h3>
      <img src={image} alt="Dropped image" />
    </div>
  ) : null;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/png",
  });


  return (
    <section className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <div {...getRootProps({ className: 'max-w-[800px] mt-[-96px] w-full h-[200px] mx-auto text-center flex flex-col justify-center' })}>
            <input {...getInputProps()} />
            <div className=" hover:cursor-pointer max-w-[800px] text-white border-2 border-solid border-[#00df9a] rounded-lg p-10">
                <FontAwesomeIcon icon={faCloudArrowUp} size="2xl" style={{color: "#00df9a",}} />
                <p >Drag'n Drop your equation image here</p>
                <em>(Only JPG and PNG files are supported)</em>
            </div>
        </div>
        {!response ? (
          <p style={{ color: "red" }}>{errorMessage}</p>
        ) : (<Card sx={{ maxWidth: 200 }} style={{ backgroundColor: '#00df9a' }} className='border-2 border-solid border-black  w-[200px] rounded-md font-medium mx-auto text-black'>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image= {image}
            alt="equationimg"
          />
          <CardContent>
            <Typography gutterBottom variant="body4" component="div" >
              Result: {response}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>)}
    </section>
  );
}

export default DropIn