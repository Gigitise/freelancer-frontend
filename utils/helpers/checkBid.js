export const checkBid = (orderContent, loadedUserProfile) => {
  return orderContent?.bidders?.some(
    (bid) => bid?.freelancer?.user.username === loadedUserProfile?.username
  );
};
