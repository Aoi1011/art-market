import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralisQuery } from 'react-moralis';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, Link, makeStyles, CardActionArea, Container, Button } from '@material-ui/core';
import GavelIcon from '@material-ui/icons/Gavel';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { red } from '@material-ui/core/colors';
import { PulseLoader } from 'react-spinners';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: '1rem',
    },
    loader: {
        textAlign: 'center',
        marginTop: '50%',
    },
    container: {
        marginTop: "5rem",
    },
    cardContainer: {
        display: 'flex',
        overflow: 'hidden',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cardRoot: {
        padding: '2rem',
    },
    carouselItem: {
        backgroundColor: '#3F50B5',
        padding: '88px 140px',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));

const MyPage = () => {
    const classes = useStyles();
    const history = useHistory();
    const [arrayData, setArrayData] = useState([]);
    const dispatch = useDispatch();
    const { accounts } = useSelector((state) => state.artToken);
    const { data, isFetching } = useMoralisQuery("Nft");

    useEffect(() => {
        const array = [];

        data.map((c) => {
            if (c.attributes["Account"] === accounts[0]) {
                if (c.attributes["IpfsUrl"] !== undefined) {
                    array.push(c);
                }
            }
        });
        setArrayData(array);
    }, [data]);

    const handleModal = (objectId, tokenId) => {
        dispatch({
            type: "SHOW_MODAL",
            functionType: "MyPage",
            title: "Do you want to put up your NFT for auction?",
            objectId: objectId,
            tokenId: tokenId,
        });
    }

    const auctionDetailHandler = (auctionDetail) => {
        dispatch({
            type: "MOVE_AUCTIONDETAIL",
            nftDetail: auctionDetail,
        });
        history.push("./auctionDetail");
    };

    return (
        <div className={classes.root}>
            {
                isFetching ?
                    (
                        <div className={classes.loader}>
                            <PulseLoader size="30" margin="2" color="#62DEC2" />
                        </div>
                    ) :
                    (
                        <>
                            <Typography align="left" component="h1" variant="h3" style={{ padding: "0rem 2rem" }}>
                                My Page
                            </Typography>
                            <div className={classes.container}>
                                <Typography component="h1" variant="h2" align="center">Your NFT</Typography>
                                <Typography component="p" variant="inherit" align="right" style={{ paddingRight: "2rem" }}>
                                    <Link href="#">
                                        See more
                                    </Link>
                                </Typography>
                                <div className={classes.cardContainer}>
                                    {arrayData.map((d) => {
                                        return (
                                            <div key={d.attributes["TokenId"]} className={classes.cardRoot}>
                                                <Card>
                                                    {d.attributes["IsSelled"] ?
                                                        <div style={{ display: 'flex', justifyContent: "space-between", padding: "0 1rem" }}>
                                                            <Typography component="span" variant="h4">Auction Now</Typography>
                                                            <IconButton aria-label="settings" onClick={() => auctionDetailHandler(d)}>
                                                                <OpenInNewIcon />
                                                            </IconButton>
                                                        </div>
                                                        :
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar aria-label="recipe" className={classes.avatar}>
                                                                    {d.attributes["Account"]}
                                                                </Avatar>
                                                            }
                                                            action={
                                                                <IconButton aria-label="settings" onClick={() => handleModal(d.id)}>
                                                                    <GavelIcon />
                                                                </IconButton>
                                                            }
                                                            title={d.attributes["Name"]}
                                                        />
                                                    }
                                                    <CardMedia
                                                        className={classes.media}
                                                        image={d.attributes["IpfsUrl"]}
                                                        title="Paella dish"
                                                    />
                                                    <CardContent>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            IPFS Hash: <br />{d.attributes["IpfsHash"]}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            IPFS URL: <br />
                                                            <Link href={d.attributes["IpfsUrl"]} target="_blank">
                                                                {d.attributes["IpfsUrl"]}
                                                            </Link>
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">
                                                            Token ID: {d.attributes["TokenId"]}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    )
            }
        </div>

    );
}

export default MyPage;
