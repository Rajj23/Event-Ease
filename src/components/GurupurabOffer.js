import { Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

function GurupurabOffer() {

    // Style for the gradient background
    const heroStyle = {
  background: 'linear-gradient(135deg, #e0a3ccff 20%, #ef756aff 100%)',
  color: '#333', // Keep dark text for the yellow part
  padding: '1.5rem 1rem', 
  borderRadius: '15px',
  textShadow: '1px 1px 2px rgba(255,255,255,0.3)'
};

    return (
        // FURTHER REDUCED margin from 'my-4' to 'my-3'
        <Container className="my-3">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <div style={heroStyle} className="text-center shadow-lg">
                    <Row className="justify-content-center">
                        {/* You can change md={10} to md={8} if you want it even narrower */}
                        <Col md={10}>
                            {/* FURTHER REDUCED font size from 'h2' to 'h3' */}
                            <h3 className="fw-bold">🌟 Gurupurab Special Offer! 🌟</h3>
                            {/* FURTHER REDUCED font size from 'fs-5' to default <p> */}
                            <p className="fw-normal">
                                Celebrate this holy occasion with joy and savings.
                            </p>
                            {/* FURTHER REDUCED margin from 'my-3' to 'my-2' */}
                            <hr className="my-2" style={{ borderColor: 'rgba(0,0,0,0.2)' }} />
                            <p style={{ fontSize: '0.95rem' }}> {/* Made text slightly smaller */}
                                Book your event with Blissful Event on or before
                                <strong> 5th November 2025</strong> and get a
                            </p>
                            {/* FURTHER REDUCED font size from 'display-5' to 'display-6' */}
                            <h2 className="display-6 fw-bolder text-danger" style={{ textShadow: 'none' }}>
                                15% OFF
                            </h2>
                            <p style={{ fontSize: '0.95rem' }}>on all event packages!</p>

                            <Button
                                size="sm"
                                variant="dark" // Keep this "dark"
                                href="/booking"
                                className="mt-2 fw-bold px-3"
                            >
                                Book Now & Claim Your Discount
                            </Button>
                        </Col>
                    </Row>
                </div>
            </motion.div>
        </Container>
    );
}

export default GurupurabOffer;