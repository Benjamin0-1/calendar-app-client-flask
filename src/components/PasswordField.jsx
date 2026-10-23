import { useState } from 'react';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';

// TextField for passwords with a show/hide toggle. Accepts every TextField prop.
function PasswordField(props) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={isVisible ? 'text' : 'password'}
            slotProps={{
                ...props.slotProps,
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title={isVisible ? 'Hide password' : 'Show password'}>
                                <IconButton
                                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                                    onClick={() => setIsVisible((prev) => !prev)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    edge="end"
                                    size="small"
                                >
                                    {isVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}

export default PasswordField;
