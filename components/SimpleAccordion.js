import React, { useState } from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
import Stepper from 'react-stepper-horizontal';

import styles from '../styles/Home.module.css'
import GoogleMaps from './GoogleMaps';


function SimpleAccordion({ data }) {

    const [activeDiv, setActiveDiv] = useState({
        numIndex: null
    })

    function toggleActive(index) {
        setActiveDiv({ numIndex: index })
    }

    function toggleActiveStyle(index) {
        if (activeDiv.numIndex == index) {
            return 'cardItemActive'
        } else {
            return 'cardItemInactive'
        }
    }

    function handleStatusEnAttente() {
        const attente = []
        data && data.getAllOrders.map(el => {
            if (el.status == "NEW") {
                attente.push(el.status)
            }
        })
        return attente.length
    }

    function handleStatusEnCours() {
        const enCours = []
        data && data.getAllOrders.map(el => {
            if (el.status !== "NEW") {
                enCours.push(el.status)
            }
        })
        return enCours.length
    }


    return (
        <Accordion defaultActiveKey="0" className={styles.accordion}>
            <Card className={styles.cardWrapper}>
                <div><strong>Les livraisons</strong></div>
                <div>En attente d'action <span className={styles.myspan}>({handleStatusEnAttente()})</span></div>
                {data && data.getAllOrders.map((item, index) => (
                    item.status == 'NEW' && (
                        <Accordion.Toggle as={Card.Header} eventKey={item.id} key={index} className={styles.card}>
                            <div
                                className={activeDiv.numIndex == index ? styles.cardItemActive : styles.cardItemInactive}
                                onClick={() => toggleActive(index)}
                            >
                                <span><strong>#{item.reference}</strong></span>
                                <span className={styles.colorGris}>{item.orderItems.length} items</span>
                            </div>
                            <hr className={styles.hr} />
                        </Accordion.Toggle>
                    )
                ))}
                <div>En cours <span className={styles.myspan}>({handleStatusEnCours()})</span></div>
                {data && data.getAllOrders.map((item, index) => (
                    item.status !== 'NEW' && (
                        <Accordion.Toggle as={Card.Header} eventKey={item.id} key={index} className={styles.card}>
                            <div
                                className={activeDiv.numIndex == index ? styles.cardItemActive : styles.cardItemInactive}
                                onClick={() => toggleActive(index)}
                            >
                                <span><strong>#{item.reference}</strong></span>
                                <span className={styles.colorGris}>{item.orderItems.length} items</span>
                            </div>
                            <hr className={styles.hr} />
                        </Accordion.Toggle>
                    )
                ))}
            </Card>
            <div className={styles.wrapperBody}>

                {data && data.getAllOrders.map((item, index) => {
                    const idOr = item.id
                    return (
                        <div className={styles.bodyCustom}>
                            <Accordion.Collapse eventKey={item.id} key={index} className={styles.collapse}>
                                <Card.Body className={styles.body}>
                                    <div className={styles.headerBody}>
                                        <span>
                                            <img className="mr-2" src="https://res.cloudinary.com/tealeaf/image/upload/v1592235704/tj7quzmsitqc7fclkqui.png" width="40" />
                                            <strong>Commande #{item.reference}</strong>

                                        </span>
                                        <span className={styles.colorGris}>{item.orderItems.length} items</span>

                                        <span>
                                            <span className={styles.colorGris}>Restaurant</span>
                                            <br />
                                            <span className={styles.colorMaron}>
                                                <strong>{item.restaurant.map(el => el.name)}</strong>
                                            </span>
                                        </span>

                                        {item.orderItems.map(el => {
                                            if (idOr == el.idOrder) {

                                                console.log('idOr', idOr)
                                                console.log('idOrder', el.idOrder)
                                            }
                                        })}
                                        <span>
                                            <span className={styles.colorGris}>A livrer en</span>
                                            <br />
                                            <span className={styles.colorMaron}><strong>32 min <i class="fas fa-pen"></i></strong></span>
                                        </span>
                                        <span className={styles.icons}>
                                            <span className={styles.telCustomer}><i class="fas fa-phone-alt"></i></span>
                                            <span><i class="fas fa-ellipsis-v"></i></span>
                                        </span>
                                    </div>
                                    <div className={styles.bodyItem}>
                                        <Stepper
                                            steps={
                                                [
                                                    { title: 'new' },
                                                    { title: 'preparing' },
                                                    { title: 'ready for pick up' },
                                                    { title: 'picked up' },
                                                    { title: 'en route' },
                                                    { title: 'delivered' },
                                                    { title: 'cancelled' }
                                                ]
                                            }
                                            activeStep={item.status == 'NEW' ? 0
                                                : item.status == 'PREPARING' ? 1
                                                    : item.status == 'READY_FOR_PICKUP' ? 2
                                                        : item.status == 'PICKED_UP' ? 3
                                                            : item.status == 'EN_ROUTE' ? 4
                                                                : item.status == 'DELIVERED' ? 5
                                                                    : 6
                                            }
                                            activeColor='#5a3309'
                                            completeColor='#5a3309'
                                            activeTitleColor='#5a3309'
                                            completeTitleColor='#5a3309'
                                            titleFontSize={11}
                                            activeBorderColor="#5a3309"
                                            completeBorderColor="#5a3309"
                                            defaultBorderWidth={1}
                                        />
                                        <div className={styles.styleMap}>
                                            <GoogleMaps />
                                        </div>

                                        <div className={styles.wrapperFooterBody}>
                                            <div className={styles.footerBody}>
                                                <span><i class="fas fa-circle"></i></span>
                                                <span className={styles.footerItems}>
                                                    <span className={styles.footerItem1}><i class="fas fa-circle"></i></span>
                                                    <span className={styles.footerItem2}><i class="fas fa-circle"></i></span>
                                                    <span className={styles.footerItem3}><i class="fas fa-circle"></i></span>
                                                </span>
                                                <span><i class="far fa-circle"></i></span>
                                            </div>
                                            <div className={styles.footerBodyAddress}>
                                                <span>{item.customer.map(el => el.name)}</span>
                                                <span>{item.restaurant.map(el => el.name)}</span>
                                            </div>
                                        </div>
                                        <Button variant="secondary" className={styles.buttonCustomer}>Attribuer à un livreur &nbsp;<i class="fas fa-check"></i></Button>
                                    </div>
                                </Card.Body>

                            </Accordion.Collapse>
                        </div>
                    )
                })}
            </div>


        </Accordion>

    )
}

export default SimpleAccordion