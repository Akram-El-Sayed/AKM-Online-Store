import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from 'react-bootstrap'


export default function ProductForm({ initial = {}, onSubmit }) {
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [price, setPrice] = useState(0)
const [category, setCategory] = useState('')


useEffect(() => {
if (initial) {
setTitle(initial.title || '')
setDescription(initial.description || '')
setPrice(initial.price || 0)
setCategory(initial.category || '')
}
}, [initial])


const submit = (e) => {
e.preventDefault()
onSubmit({ title, description, price: Number(price), category })
}


return (
<Card className="p-3">
<Form onSubmit={submit}>
<Form.Group className="mb-2">
<Form.Label>Title</Form.Label>
<Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Description</Form.Label>
<Form.Control as="textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Price</Form.Label>
<Form.Control type="number" value={price} onChange={e => setPrice(e.target.value)} required />
</Form.Group>
<Form.Group className="mb-2">
<Form.Label>Category</Form.Label>
<Form.Control value={category} onChange={e => setCategory(e.target.value)} />
</Form.Group>
<Button type="submit">Save</Button>
</Form>
</Card>
)
}