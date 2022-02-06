import fetch from 'node-fetch';

const ApiUrl = 'http://localhost:5000/item/';

export const items_list = async (req, res) => {
    const response = await fetch(ApiUrl);
    const items = await response.json();
    res.render('Home', {items: items});
}


export default {items_list};