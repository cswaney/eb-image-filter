import bodyParser from 'body-parser';
import express, { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // endpoint to filter an image from a public url.
  // REQUEST
  //   GET /filteredimage?image_url={{URL}}
  // RESPONSE
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage/", (req: Request, res: Response) => {
    let { image_url } = req.query;

    // validate the image_url query
    if ( !image_url ) {
      return res.status(400)
        .send(`image_url is required`);
    }

    // TODO: error handling
    // call filterImageFromURL(image_url) to filter the image (and return local image path)
    filterImageFromURL(image_url).then(filteredpath => {
      // send the resulting file in the response
      return res.status(200)
        .sendFile(filteredpath, () => {  // transfers the file at the given path
          console.log('Sent:', filteredpath)
          deleteLocalFiles([filteredpath])  // deletes any files on the server on finish of the response
        })
    })

  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();