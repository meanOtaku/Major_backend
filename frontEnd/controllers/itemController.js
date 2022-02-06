import fetch from 'node-fetch';

const ApiUrl = 'http://localhost:5000/item/';

export const items_info = async (req, res) => {
    const response = await fetch(ApiUrl + req.params.id);
    const item = await response.json();
    res.render('Item', {item: item});
}


export default {items_info};