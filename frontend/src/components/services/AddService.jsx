<ModalWindow showModal={showModal} headerText={isEditing?'Изменение сервисной организации':'Добавление сервисной организации'} closeModal={closeModalButton}>
        <form onSubmit={handleSubmit}>
            {isEditing&&
            <FormControl fullWidth margin="normal">
                <TextField
                    id='username'
                    label='username'
                    variant='outlined'
                    name='username'
                    value={formData.username}
                    onChange={handleChange}
                    error={formErrors.username}
                    required
                    disabled={true} 
                />
            </FormControl>}
            <FormControl fullWidth margin="normal">
                <TextField
                    id='name'
                    label='Название организации'
                    variant='outlined'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    error={formErrors.name}
                    helperText={formErrors.name && "Организация не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
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
                    value={formData.description}
                    onChange={handleChange}
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_first_name'
                    label='Имя директора'
                    variant='outlined'
                    name='user_first_name'
                    value={formData.user_first_name}
                    onChange={handleChange}
                    error={formErrors.user_first_name}
                    helperText={formErrors.user_first_name && "Имя директора не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_last_name'
                    label='Фамилия директора'
                    variant='outlined'
                    name='user_last_name'
                    value={formData.user_last_name}
                    onChange={handleChange}
                    error={formErrors.user_last_name}
                    helperText={formErrors.user_last_name && "Фамилия директора не может быть пустым"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <TextField
                    id='user_email'
                    label='email'
                    variant='outlined'
                    name='user_email'
                    value={formData.user_email}
                    onChange={handleChange}
                    error={formErrors.user_email}
                    helperText={formErrors.user_email && "Введите корректный email"}
                    required
                    disabled={formLoading|| refreshPasswordLoading} 
                />
            </FormControl>
            <div className='formButtons'>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid()||formLoading|| refreshPasswordLoading} 
                >{formLoading?<CircularProgress  />:<>{isEditing?"Сохранить":"Добавить"}</>}
                </Button>
                    {isEditing&&<Button
                    variant="contained"
                    color="primary"
                    onClick={handleResetPassword}
                    disabled={editingItem.user_email!=formData.user_email||refreshPasswordLoading||formLoading} 
                    >
                    {refreshPasswordLoading?<CircularProgress  />:'Сбросить пароль'}
                </Button>}
            </div>
        </form>
    </ModalWindow>