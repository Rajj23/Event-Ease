import React, { useState } from 'react'; // --- Re-added useState ---
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap'; // --- Re-added Modal ---
import { motion } from 'framer-motion';

// --- Re-added react-share imports ---
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon
} from 'react-share';

// --- (Your old CSS import) ---
// import './OffersPage.css';

function OffersPage() {

  // --- Re-added state for the modal ---
  const [showShareModal, setShowShareModal] = useState(false);
  const handleCloseShare = () => setShowShareModal(false);
  const handleShowShare = () => setShowShareModal(true);

  // --- Re-added share details ---
  // !! IMPORTANT: Change this to your website's real URL
  const shareUrl = "https://www.your-blissful-event-website.com/offers"; 
  const shareTitle = "Check out these amazing offers from Blissful Event!";

  // Staggered animation for the cards
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    whileInView: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Background styles for each offer card
  const offerBackgrounds = [
    { gradient: 'linear-gradient(135deg, #a777e3 0%, #7B4397 100%)', iconBg: '#6a3d99' }, // Purple
    { gradient: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)', iconBg: '#1e88a0' }, // Blue
    { gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', iconBg: '#e6677f' }, // Pink/Coral
    // --- ADDED 4th GRADIENT (GREEN) ---
    { gradient: 'linear-gradient(135deg, #28b485 0%, #7ed56f 100%)', iconBg: '#28b485' }  // Green
  ];

  return (
    <>
      <Container className="my-5 py-4">
        
        {/* --- Page Title Section --- */}
        <Row className="justify-content-center text-center mb-5">
          <Col md={10} lg={8}>
            <motion.h1 
              className="display-4 fw-bold text-dark"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Exclusive Offers from Blissful Event
            </motion.h1>
            <motion.p 
              className="lead text-secondary fs-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Unlock amazing savings and make your celebrations even more special.
              Don't miss out on these limited-time deals!
            </motion.p>

            {/* --- Re-added Share Button --- */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Button 
                variant="outline-primary" 
                onClick={handleShowShare} 
                className="mt-3 fw-bold"
              >
                📤 Share These Offers
              </Button>
            </motion.div>

          </Col>
        </Row>

        {/* --- Offers Cards --- */}
        <Row className="justify-content-center g-4">
          
          {/* --- Offer 1: Refer & Earn --- */}
          <Col md={6} lg={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card 
                className="h-100 border-0 shadow-lg text-white"
                style={{ background: offerBackgrounds[0].gradient }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div 
                    className="rounded-circle d-inline-flex justify-content-center align-items-center mb-4"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: offerBackgrounds[0].iconBg,
                      fontSize: '2.2rem'
                    }}
                  >
                    🤝
                  </div>
                  <h3 className="fw-bold mb-2">Refer & Earn Offer</h3>
                  <Card.Subtitle className="mb-3 text-white-50">
                    Valid All Month Long!
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    When you refer a friend, <strong>both of you get ₹500 OFF</strong> on your next event booking. No limit on referrals!
                  </Card.Text>
                  <Button 
                    variant="light"
                    onClick={handleShowShare}
                    className="mt-3 fw-bold px-4 py-2 text-primary"
                  >
                    Refer a Friend
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* --- Offer 2: Décor Discount --- */}
          <Col md={6} lg={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: 0.15 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card 
                className="h-100 border-0 shadow-lg text-white" 
                style={{ background: offerBackgrounds[1].gradient }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div 
                    className="rounded-circle d-inline-flex justify-content-center align-items-center mb-4"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: offerBackgrounds[1].iconBg,
                      fontSize: '2.2rem'
                    }}
                  >
                    🎨
                  </div>
                  <h3 className="fw-bold mb-2">Flat ₹500 OFF on Decor</h3>
                  <Card.Subtitle className="mb-3 text-white-50">
                    For Family Functions & Birthdays
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    Book any decor package for family functions or birthdays and get an instant <strong>₹500 discount</strong>.
                  </Card.Text>
                  <Button 
                    variant="light" 
                    href="/inspiration" 
                    className="mt-3 fw-bold px-4 py-2 text-info"
                  >
                    Explore Decor
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* --- Offer 3: Gurupurab Special --- */}
          <Col md={6} lg={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: 0.3 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card 
                className="h-100 border-0 shadow-lg text-white" 
                style={{ background: offerBackgrounds[2].gradient }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div 
                    className="rounded-circle d-inline-flex justify-content-center align-items-center mb-4"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: offerBackgrounds[2].iconBg,
                      fontSize: '2.2rem'
                    }}
                  >
                    🎁
                  </div>
                  <h3 className="fw-bold mb-2">Gurupurab Early Bird Gift</h3>
                  <Card.Subtitle className="mb-3 text-white-50">
                    First 10 bookings on 5th Nov!
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    The first 10 bookings on 5th November get a <strong>FREE customized return gift basket</strong> (worth ₹1,000)!
                  </Card.Text>
                  <Button 
                    variant="light" 
                    href="/create" 
                    className="mt-3 fw-bold px-4 py-2 text-danger"
                  >
                    Book Your Event
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* --- NEW OFFER: First-Time Booking --- */}
          <Col md={6} lg={4}>
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="whileInView"
              transition={{ delay: 0.45 }} // Staggered delay
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card 
                className="h-100 border-0 shadow-lg text-white" 
                style={{ background: offerBackgrounds[3].gradient }}
              >
                <Card.Body className="p-4 d-flex flex-column">
                  <div 
                    className="rounded-circle d-inline-flex justify-content-center align-items-center mb-4"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: offerBackgrounds[3].iconBg,
                      fontSize: '2.2rem'
                    }}
                  >
                    👉
                  </div>
                  <h3 className="fw-bold mb-2">First-Time Booking Offer</h3>
                  <Card.Subtitle className="mb-3 text-white-50">
                    A Welcome Gift For You
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1">
                    First-time customers get <strong>5% OFF</strong> on any event package. A warm welcome to Blissful Event!
                  </Card.Text>
                  <Button 
                    variant="light" 
                    href="/create" 
                    className="mt-3 fw-bold px-4 py-2 text-success" // text-success matches green
                  >
                    Book Your First Event
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
        </Row>
      </Container>

      {/* --- Re-added Share Modal --- */}
      <Modal show={showShareModal} onHide={handleCloseShare} centered>
        <Modal.Header closeButton>
          <Modal.Title>Share These Offers!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center text-muted">Know someone who'd love these deals?</p>
          <div className="d-flex justify-content-around p-3">
            
            <FacebookShareButton url={shareUrl} quote={shareTitle}>
              <FacebookIcon size={64} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <TwitterIcon size={64} round />
            </TwitterShareButton>
            
            <WhatsappShareButton url={shareUrl} title={shareTitle} separator=":: ">
              <WhatsappIcon size={64} round />
            </WhatsappShareButton>

            <LinkedinShareButton url={shareUrl} title={shareTitle} summary="Amazing event offers!">
              <LinkedinIcon size={64} round />
            </LinkedinShareButton>

          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default OffersPage;