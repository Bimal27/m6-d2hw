import {Router} from "express"
import pool from "../../utils/db.js"
const route = Router()


route.get("/",async(req,res,next)=>{
    try {
        const query = `SELECT * FROM reviews;`
        const result = await pool.query(query)
        res.send(result.rows)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.get("/:id",async(req,res,next)=>{
    try {
        const query = `SELECT * FROM reviews WHERE product_id=${req.params.id};`
      
        const result = await pool.query(query)
        if(result.rows.length > 0){
            const review = result.rows[0]
            const productsQuery = `SELECT * FROM products WHERE review=${req.params.id};`
            const productsResult = await pool.query(productsQuery)
            const products = productsResult.rows
            res.send({review,products})
        }
        else{
            res.status(404).send({message:`Reviews with ${req.params.id} is not found.`})
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.delete("/:id",async(req,res,next)=>{
    try {
        const query = `DELETE FROM reviews WHERE review_id=${req.params.id};`
        await pool.query(query)
        res.status(204).send()
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.put("/:id",async(req,res,next)=>{
    try {
        const {comment,rate,product_id} = req.body;
        const query =`
            UPDATE products 
            SET 
                comment=${"'"+comment+"'"},
                rate=${"'"+rate+"'"},
                product_id=${"'"+product_id+"'"},
                updated_at= NOW()
            WHERE review_id=${req.params.id}
            RETURNING*;`
        const result = await pool.query(query)
        res.send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

route.post("/",async(req,res,next)=>{
    try {
        const { comment,rate,product_id } = req.body;
        const query =`
        INSERT INTO products
        (
            comment,
            rate,
            product_id,
            
        )
        VALUES 
        (
            ${"'"+comment+"'"},
            ${"'"+rate+"'"},
            ${"'"+product_id+"'"},
        
        ) RETURNING *;
        `
        const result = await pool.query(query)
        res.status(201).send(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


export default route;