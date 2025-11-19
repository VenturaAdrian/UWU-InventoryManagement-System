import { forwardRef } from 'react';

// react-bootstrap
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

// ==============================|| MAIN CARD ||============================== //

const LoginMainCard = forwardRef(
    (
        {
            children,
            subheader,
            footer,
            secondary,
            content = true,
            codeString,
            title,
            className,
            headerClassName,
            bodyClassName,
            footerClassName
        },
        ref
    ) => {
        return (
            <Card ref={ref} className={className} style={{
                width: '100%',       // makes it take full width of parent
                maxWidth: '500px',   // caps the width to 500px
                margin: '0 auto',    // centers the card horizontally
            }}>
                {/* Header Section */}
                {title && (
                    <Card.Header className={headerClassName}>
                        <Stack direction="horizontal" gap={2} className="flex-wrap justify-content-between">
                            <Stack className="align-self-center">
                                {typeof title === 'string' ? <h5>{title}</h5> : title}
                                {subheader && <small className="text-muted">{subheader}</small>}
                            </Stack>
                            {secondary}
                        </Stack>
                    </Card.Header>
                )}
                {/* Content */}
                {content && <Card.Body className={bodyClassName}>{children}</Card.Body>}
                {!content && children}
                {/* Footer Section for Code Highlighting */}
                {codeString && <hr />}
                {footer && <Card.Footer className={footerClassName}>{footer}</Card.Footer>}
            </Card>
        );
    }
);

export default LoginMainCard;
