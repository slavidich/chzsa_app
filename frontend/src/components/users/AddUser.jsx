<ModalWindow showModal={showModal} headerText={isEditing?'Изменение пользователя':'Добавление пользователя'} closeModal={closeModal}>
                    <form onSubmit={handleSubmit}>
                        {isEditing&&<FormControl fullWidth margin="normal">
                            <TextField
                                id="username"
                                label='username'
                                variant="outlined"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                error={errors.username}
                                helperText={errors.username && "Имя не может быть пустым"}
                                required
                                disabled
                            />
                        </FormControl>}
                        
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="first_name"
                                label='Имя клиента'
                                variant="outlined"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                error={errors.first_name}
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.first_name && "Имя не может быть пустым"}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="last_name"
                                label="Фамилия клиента"
                                variant="outlined"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                error={errors.last_name}
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.last_name && "Фамилия не может быть пустой"}
                                required
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                id="email"
                                label="Почта"
                                variant="outlined"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                disabled={formLoading||refreshPasswordLoading} 
                                helperText={errors.email && "Введите корректный email"}
                                required
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
                                disabled={editingItem.email!=formData.email||refreshPasswordLoading} 
                                >
                                {refreshPasswordLoading?<CircularProgress  />:'Сбросить пароль'}
                            </Button>}
                        </div>
                    </form>
                </ModalWindow>