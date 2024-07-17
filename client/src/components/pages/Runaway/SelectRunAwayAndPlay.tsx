import React,{ useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigation } from "react-router-dom";



interface PropTypes {}

export const RunAways: React.FC<PropTypes> = () => {

  const[ownerRunAways, setOwnerRunAways] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRunawayId, setSelectedRunawayId] = useState<number | null>(null);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [gameOver, setGameOver] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [hasRunaways, setHasRunAways] = useState(false)




    return (
      <>

      </>
    );
  };
