export const checkBid = (orderContent, loadedUserProfile) => {
  const isMyBid = orderContent?.bidders?.some(
    (bid) => bid?.freelancer?.user.username === loadedUserProfile?.username
  );

  return isMyBid;
};
