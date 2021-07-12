const { query } = require("express")
const express = require("express")
const app = express()

const productArray = require("./models/Products")

const HOSTNAME = "127.0.0.1"
const PORT = 8080

app.use(express.json())



// ROOT PATH
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Nelson's CRUD path</h1>")  
})



// CREATE OPERATION - Adds a product to the array of product objects
// E.G. http://127.0.0.1:8080/new-product/?productname=First dynamical product&productdescription=Some description for the first new product&productimage=http://myimageurl.com/images/first-new-image.jpg&productprice=41500
app.post("/new-product", addProduct, (req, res) => {
    res.send("Product created")  
})


// Using middleware
function addProduct(req, res, next){

    // Using destructuring method to get all the expected query strings
    let { productname, productdescription, productimage, productprice } = req.query;

    // Converting the price to number
    productprice = parseInt(productprice);

    // Generating a unique id with Unix time for every new product coming.
    let productUniqueId = Date.now();

    // Organizing the submitted query strings into an object 
    let newProductObject = {
        id: productUniqueId,
        name: productname,
        description: productdescription,
        image: productimage,
        price: productprice
    }

    // Adding to the product array
   productArray.push(newProductObject)

   // Returning the array with the newly added item
   res.json(productArray).statusCode(200)

   return next()
}



// READ OPERATION - List all products 
// To delete a product, do something like so: http://127.0.0.1:8080/view-products
app.get("/view-products", (req, res) => {
    res.json(res.send(productArray)).statusCode(200)  
})


// UPDATE OPERATION - Adds a product to the array of product objects
//USE: http://127.0.0.1:8080/update-product/2/?productname=Mecedes Benz C300 Update&productdescription=Some description for the newly updated product.&productimage=https://carsimage.com/cars/mecedes.jpg&productprice=7200000
app.put("/update-product/:id", updateMiddlewWare, (req, res) => {
    res.json(res.send(productArray)).statusCode(200)  
})


// Using middleware to update the record
function updateMiddlewWare(req, res, next){

    let productid = req.params.id;

    let {productname, productdescription, productimage, productprice } = req.query

    productid = parseInt(productid)
    productprice = parseInt(productprice)

    // Getting the index of where the passed Item Id is in the array of object (data source).
   let queryIndex =  productArray.findIndex(productItem => productItem.id === productid)

   queryIndex = parseInt(queryIndex)

   //  We will only update the product record if the findIndex() array method returns a record index
   if(! (queryIndex === -1)){
    
    // updating the object values

   // productArray[queryIndex].id  = productid        We could modify the id too, but we don't want the user to modify the product id
   productArray[queryIndex].name  = productname
   productArray[queryIndex].description  = productdescription
   productArray[queryIndex].image  = productimage
   productArray[queryIndex].price  = productprice

    }
    else{
        res.send("Product ID for this product does not exists on our database!").statusCode(200)
    }

   
   res.json(res.send(productArray)).statusCode(200)
    
    return next()
}



// DELETE OPERATION - Using middleware
// To delete a product, do something like so: http://127.0.0.1:8080/delete-product/2/
app.delete("/delete-product/:id/", deleteProduct, (req, res) => {
     
})


// Handling the delete request with middleware
function deleteProduct(req, res, next){

    // Getting the product index from the query string
    
    let itemId = parseInt(req.params.id);

    // Getting the index of where the passed Item Id is in the array of object (data source) so that we can delete only that object.

    let queryIndex = 0;

    queryIndex  =  productArray.findIndex(productItem => productItem.id === itemId)

    queryIndex = parseInt(queryIndex)

    // Ensuring that the item with that id was found before performing the delete operation.
    if(! (queryIndex === -1)){
    // Deleting the object from the array
    productArray.splice(queryIndex, 1)
    }
    else{
        res.send("Product ID for this product does not exists on our database!")
    }
    

// Returning the array after deleting the item that matches the query
 res.json(res.send(productArray)).statusCode(200)
    return next()
}


// 404 ERROR 
app.get("*", (req, res) => {
    res.send("<h1>Sorry! What you're looking for cannot be found.</h1>")  
})



app.listen(PORT, HOSTNAME, ()=>{
    console.log(`Server is running at HOST: ${HOSTNAME} on port: ${PORT}`)
})