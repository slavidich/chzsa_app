import React, {useState} from "react";

function AddDirectory(){
    const [formData, setFormData] = useState({ // новая запись
        name: '', 
        description: '' 
    }); 
    const [formErrors, setFormErrors] = useState({
        name: false,
        description: false,
    })
    
    return(<div>
        Добавление новой директории
    </div>)
}

export default AddDirectory

/*
<ModalWindow headerText={isEditing ? 'Редактировать элемент' : 'Добавить новый элемент'} showModal={showModal} closeModal={closeModal}>
                <form onSubmit={handleAddOrEdit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            id='name'
                            label='Название'
                            variant='outlined'
                            name='name'
                            value={newDirectory.name}
                            onChange={handleChange}
                            error={formError.name}
                            helperText={formError.name && "Поле не может быть пустым"}
                            disabled={formLoading}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            multiline
                            rows={4}
                            id='description'
                            label='Описание'
                            variant='outlined'
                            name='description'
                            value={newDirectory.description}
                            onChange={handleChange}
                            disabled={formLoading}
                            error={formError.description}
                            helperText={formError.description && "Поле не может быть пустым"}
                            required
                        />
                    </FormControl>
                    <div className="formButtons">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={!isValid()||formLoading} >
                            {formLoading?<CircularProgress  />:<>{isEditing?"Сохранить":"Добавить"}</>}
                        </Button>
                        
                    </div>
                </form>
            </ModalWindow>
            
            const handleEdit = (item) => {
        console.log(item)
        setShowModal(true)
        setSelectedItem(item);
        setNewDirectory({ name: item.name, description: item.description });
        setIsEditing(true);
    };
    const handleAdd = ()=>{
        setShowModal(true)
        setIsEditing(false);
    }
    const closeModal = ()=>{
        setShowModal(false)
        setNewDirectory({ name: '', description: '' })
    }
    const handleChange = (e)=>{
        const {name, value} = e.target
        setNewDirectory({
            ...newDirectory,
            [name]: value
        })
        validateField(name, value)
    }
    const validateField = (name, value)=>{
        if (value===''){
            setFormErrors({
                ...formError,
                [name]:true
            })
        }else{
            setFormErrors({
                ...formError,
                [name]:false
            })
        }
    }
    const handleAddOrEdit = async (e) => {
        e.preventDefault()
        await refreshTokenIfNeeded(dispatch)
        setFormLoading(true)
        try {
            if (isEditing){
                await axios.put(`${mainAddress}/api/directories`,{id:selectedItem.id, name:newDirectory.name, description: newDirectory.description }, {withCredentials:true})
            } else{
                await axios.post(`${mainAddress}/api/directories`, { entity_name: activeType, name: newDirectory.name, description: newDirectory.description }, { withCredentials: true });
            }
            setShowModal(false); 
            setNewDirectory({ name: '', description: '' })
            setIsEditing(false);
            setRefreshKey(prevstate=>!prevstate)
        } catch (error) {
            console.error(error);
        }
        setFormLoading(false)
    };
    const isValid = ()=>{
        for (let key in newDirectory){
            if (newDirectory[key]===''){
                return false
            }
        }
        return true
    }
    
    */